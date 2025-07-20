import Interview from '../models/Interview.js';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import Job from '../models/Job.js';
import JobApplication from '../models/JobApplication.js';


export const getCandidateDashboard = async (req, res) => {
  try {
    const candidate = await User.findByPk(req.session.user.id);
    res.status(200).json({ success: true, candidate });
  } catch (err) {
    console.error('Error loading dashboard:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const getCandidateInterviews = async (req, res) => {
  try {
    const interviews = await Interview.findAll({
      where: { candidateId: req.session.user.id },
      include: [
        {
          model: User,
          as: 'recruiter',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(200).json({ success: true, interviews });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getCandidateFullDashboard = async (req, res) => {
  try {
    const resume = await Resume.findOne({ where: { userId: req.session.user.id } });
    res.status(200).json({ success: true, user: req.session.user, resume });
  } catch (err) {
    console.error('Error loading full dashboard:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.status(200).json({ success: true, jobs });
  } catch (err) {
    console.error(' Error fetching jobs:', err);
    res.status(500).json({ success: false, message: 'Failed to load jobs' });
  }
};

export const applyToJob = async (req, res) => {
  const jobId = req.params.jobId;
  const candidateId = req.session.user.id;

  try {
    const existing = await JobApplication.findOne({ where: { jobId, candidateId } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already applied to this job' });
    }

    await JobApplication.create({ jobId, candidateId });
    res.status(201).json({ success: true, message: 'Applied to job successfully' });
  } catch (err) {
    console.error('Error applying to job:', err);
    res.status(500).json({ success: false, message: 'Failed to apply to job' });
  }
};


export const getAppliedJobs = async (req, res) => {
  try {
    const applications = await JobApplication.findAll({
      where: { candidateId: req.session.user.id },
      include: [
        {
          model: Job,
          as: 'appliedJob',
          include: [
            {
              model: User,
              as: 'recruiter',
              attributes: ['name', 'email']
            }
          ]
        }
      ]
    });

    res.status(200).json({ success: true, applications });
  } catch (err) {
    console.error('Error loading applied jobs:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getJobsWithApplicationStatus = async (req, res) => {
  try {
    const candidateId = req.session.user.id;

    const jobs = await Job.findAll();

    const applications = await JobApplication.findAll({
      where: { candidateId }
    });

    const appliedJobIds = new Set(applications.map(app => app.jobId));

    const jobsWithStatus = jobs.map(job => ({
      ...job.get({ plain: true }),
      isApplied: appliedJobIds.has(job.id),
    }));

    res.status(200).json({ success: true, jobs: jobsWithStatus });
  } catch (error) {
    console.error("Error fetching jobs with status:", error);
    res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
};



export const getCandidateProfile = (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  res.status(200).json({ success: true, user });
};


export const updateCandidateProfile = async (req, res) => {
  const { id } = req.session.user;

  const {
    name,
    email,
    dob,
    gender,
    address,
    phone,
    linkedin,
    github,
    education,
    experience
  } = req.body;

  try {
    await User.update(
      {
        name,
        email,
        dob,
        gender,
        address,
        phone,
        linkedin,
        github,
        education,
        experience
      },
      { where: { id } }
    );

  
    const updatedUser = await User.findByPk(id);

    req.session.user = updatedUser.get({ plain: true });

    res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




export const logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  });
};
