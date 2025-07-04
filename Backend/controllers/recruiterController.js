// controllers/recruiterController.js
import User from '../models/User.js';
import Interview from '../models/Interview.js';
import Resume from '../models/Resume.js';
import Job from '../models/Job.js';
import JobApplication from '../models/JobApplication.js';
import QuestionSet from '../models/QuestionSet.js';
import AssessmentResult from '../models/AssessmentResult.js';
import sendVerificationEmail from '../utils/sendEmail.js';
import { sendCustomEmail } from '../utils/sendCustomEmail.js';
import sendInterviewEmail from '../utils/sendInterviewEmail.js';
import Recruiter from '../models/Recruiter.js';

export const getJobs = async (req, res) => {
  try {
    const recruiterId = req.session.user?.id;
    const jobs = await Job.findAll({ where: { recruiterId } });
    res.json({ success: true, jobs });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
};


export const getCandidatesWithResume = async (req, res) => {
  try {
    const candidates = await User.findAll({
      where: { role: 'candidate' },
      include: [
        {
          model: Resume,
          as: 'resume', // 👈 This must match the association
          attributes: ['filePath', 'extractedData']
        }
      ],
      attributes: ['id', 'name', 'email']
    });

    res.json({ success: true, candidates });
  } catch (err) {
    console.error('Error fetching candidates:', err);
    res.status(500).json({ success: false, message: 'Error fetching candidates' });
  }
};


export const getProfile = async (req, res) => {
  try {
    const recruiterId = req.session.user?.id;
    if (!recruiterId) return res.status(401).json({ error: "Unauthorized" });

    const recruiter = await User.findByPk(recruiterId);
    if (!recruiter) return res.status(404).json({ error: "Recruiter not found" });

    res.json(recruiter);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const recruiterId = req.session.user?.id;
    const { name, phone, company, location, bio, linkedin, experience } = req.body;

    const updated = await User.update(
      { name, phone, company, location, bio, linkedin, experience },
      { where: { id: recruiterId } }
    );

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
};

export const getRecruiterInterviews = async (req, res) => {
  try {
    const recruiterId = req.session.user.id; 
    const interviews = await Interview.findAll({
      where: { recruiterId },
      include: [
        { model: User, as: 'candidate', attributes: ['id', 'name', 'email'] },
      
      ],
      order: [['date', 'ASC'], ['time', 'ASC']],
    });

    res.json({ success: true, interviews });
  } catch (err) {
    console.error('Error fetching recruiter interviews:', err);
    res.status(500).json({ success: false, message: 'Error fetching interviews' });
  }
};

export const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.findAll({
      include: [
        { model: User, as: 'candidate' },
        { model: User, as: 'recruiter' }
      ]
    });
    res.json({ success: true, interviews });
  } catch (err) {
    console.error('Error fetching interviews:', err);
    res.status(500).json({ success: false, message: 'Error fetching interviews' });
  }
};

export const postJob = async (req, res) => {
  console.log('Session at job post:', req.session.user);
  try {
    const {
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
    } = req.body;

    if (!title || !company || !location || !type || !description || !requirements) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled' });
    }

    const existingJob = await Job.findOne({
      where: {
        recruiterId: req.session.user.id,
        title,
        company,
      },
    });

    if (existingJob) {
      return res.status(409).json({
        success: false,
        message: 'This job has already been posted by you.',
      });
    }

   
    await Job.create({
      recruiterId: req.session.user.id,
      title,
      company,
      location,
      type,
      salary,
      description,
      skillsRequired: requirements,
    });

    res.json({ success: true, message: 'Job posted successfully' });
  } catch (err) {
    console.error('Error posting job:', err);
    res.status(500).json({ success: false, message: 'Error posting job' });
  }
};


export const scheduleInterview = async (req, res) => {
  const { candidateId, jobId, date, time, platform, link ,venue} = req.body;

  if (!candidateId || !jobId || !date || !time || !platform || !venue || !link) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
   
    await Interview.create({
      candidateId,
      jobId,
      recruiterId: req.session.user.id,
      date,
      time,
      platform,
      link,
      venue
    });

    
    const candidate = await User.findByPk(candidateId);
    if (!candidate || !candidate.email) {
      return res.status(404).json({ success: false, message: 'Candidate not found or email missing' });
    }

  
    const subject = '📅 Your Interview has been Scheduled';
    const html = `
      <p>Hello <strong>${candidate.name}</strong>,</p>
      <p>Your interview has been scheduled. Please find the details below:</p>
      <ul>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${time}</li>
        <li><strong>Platform:</strong> ${platform}</li>
        <li><strong>Meeting Link:</strong> <a href="${link}">${link}</a></li>
         <li><strong>Venue:</strong> ${venue}</li>
      </ul>
      <p>Best of luck for your interview!</p>
      <p>– Team HireIQ</p>
    `;

    await sendInterviewEmail(candidate.email, subject, html);

   
    res.json({ success: true, message: 'Interview scheduled and email sent' });

  } catch (err) {
    console.error('Interview scheduling failed:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getApplicantsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await JobApplication.findAll({
      where: { jobId },
      include: [
        {
          model: User,
          as: 'candidate',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json({ success: true, applications });
  } catch (err) {
    console.error('Failed to fetch applicants:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching applicants' });
  }
};




export const getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job || job.recruiterId !== req.session.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized or job not found' });
    }

    res.json({ success: true, job });
  } catch (err) {
    console.error('Error fetching job:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { title, description, location, skillsRequired } = req.body;
    const job = await Job.findByPk(req.params.id);

    if (!job || job.recruiterId !== req.session.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized or job not found' });
    }

    await job.update({ title, description, location, skillsRequired });
    res.json({ success: true, message: 'Job updated successfully' });
  } catch (err) {
    console.error('Error updating job:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job || job.recruiterId !== req.session.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized or job not found' });
    }

    await job.destroy();
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (err) {
    console.error('Error deleting job:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



export const viewAssessmentSubmissions = async (req, res) => {
  try {
    const recruiterId = req.session.user.id;

    const assessments = await QuestionSet.findAll({
      where: { recruiterId },
      include: {
        model: AssessmentResult,
        include: [User],
      },
    });

    const submittedAssessments = assessments.filter(
      (a) => a.AssessmentResults && a.AssessmentResults.length > 0
    );

    res.status(200).json({
      success: true,
      message: 'Submitted assessments retrieved successfully.',
      assessments: submittedAssessments,
    });
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({
      success: false,
      message: 'Error loading assessment submissions.',
    });
  }
};



export const viewPostedJobs = async (req, res) => {
  try {
    const recruiterId = req.session.user?.id;

    if (!recruiterId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Session expired or not found' });
    }

    const jobs = await Job.findAll({
      where: { recruiterId },
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, jobs });
  } catch (err) {
    console.error('Error fetching posted jobs:', err);
    res.status(500).json({ success: false, message: 'Error fetching posted jobs' });
  }
};

export const updateAssessmentStatus = async (req, res) => {
  const { resultId, status } = req.body;

  try {
    const result = await AssessmentResult.findByPk(resultId, { include: [User] });
    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    result.status = status;
    await result.save();

    
    let subject, text;
    if (status === 'Selected') {
      subject = 'Congratulations! You have been selected';
      text = `Dear ${result.User.name},\n\nYou have been selected based on your assessment.\n\nBest regards,\nTeam HireIQ`;
    } else if (status === 'Rejected') {
      subject = 'Update on your assessment';
      text = `Dear ${result.User.name},\n\nUnfortunately, your assessment result status is Rejected.\n\nThank you for your participation.\n\nBest regards,\nTeam HireIQ`;
    } else if (status === 'Pending') {
      subject = 'Assessment status updated';
      text = `Dear ${result.User.name},\n\nYour assessment status has been updated to Pending.\n\nBest regards,\nTeam HireIQ`;
    } else {
     
      subject = null;
    }

    if (subject) {
      await sendCustomEmail(result.User.email, subject, text);
    }

    res.json({ success: true, message: 'Status updated successfully and email sent if applicable.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error updating status.' });
  }
};

