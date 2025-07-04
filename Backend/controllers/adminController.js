
import User from "../models/User.js";
import QuestionSet from '../models/QuestionSet.js'
import AssessmentResult from '../models/AssessmentResult.js'
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
export const showAdminAnalytics = async (req, res) => {
  try {
    const totalRecruiters = await User.count({ where: { role: 'recruiter' } });
    const totalCandidates = await User.count({ where: { role: 'candidate' } });
    const totalAssessments = await QuestionSet.count();
    const totalSubmissions = await AssessmentResult.count();
    const totalJobs = await Job.count();
    const totalApplications = await JobApplication.count();

    res.json({
      totalRecruiters,
      totalCandidates,
      totalAssessments,
      totalSubmissions,
      totalApplications,
      totalJobs
    });
  } catch (err) {
    console.error('Admin Analytics API Error:', err);
    res.status(500).json({ error: 'Failed to load analytics' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });
    res.json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      include: [{
        model: User,
        as: 'recruiter',
        attributes: ['id', 'name', 'email'],
      }],
      order: [['createdAt', 'DESC']],
    });
    res.json(jobs);
  } catch (error) {
    console.error('Error in getAllJobs:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
export const updateUserById = async (req, res) => {
  console.log('Received PUT for user:', req.params.id); 
  console.log('Payload:', req.body); 

  try {
    const user = await User.findByPk(req.params.id);
    console.log('Found user:', user);

    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
    });

    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};



export const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed', error: err.message });
  }
};

export const updateJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    await job.update(req.body);
    res.json({ message: 'Job updated successfully', job });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};


export const deleteJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    await job.destroy();
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed', error: err.message });
  }
};