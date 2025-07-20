import express from 'express';
import Job from '../models/Job.js';
import JobApplication from '../models/JobApplication.js';
import { isCandidate } from '../middleware/authMiddleware.js';
import { Op } from 'sequelize';

import {
  getCandidateDashboard,
  getCandidateInterviews,
  getCandidateFullDashboard,
  getAllJobs,
  applyToJob,
  getAppliedJobs,
  getCandidateProfile,
  updateCandidateProfile,
  getJobsWithApplicationStatus,
  logoutUser
} from '../controllers/candidateController.js';


const router = express.Router();

router.get('/candidate/dashboard', isCandidate, getCandidateDashboard);
router.get('/candidate/full-dashboard', isCandidate, getCandidateFullDashboard);
router.get('/candidate/interviews', isCandidate, getCandidateInterviews);
router.get('/candidate/jobs', isCandidate, getAllJobs);

router.get('/candidate/jobs-with-status', getJobsWithApplicationStatus);
router.post('/candidate/apply/:jobId', isCandidate, applyToJob);
router.get('/candidate/applied-jobs', isCandidate, getAppliedJobs);
router.get('/candidate/profile', getCandidateProfile);
router.post('/candidate/profile/update', updateCandidateProfile);
router.get('/test-session', (req, res) => {
  res.json({ session: req.session.user });
});

router.get('/candidate/latest', isCandidate, async (req, res) => {
  try {
    // ✅ Fix: Correctly get candidate ID from session
    const userId = req.session?.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // ✅ Get all job IDs that this candidate has already applied to
    const applied = await JobApplication.findAll({
      where: { candidateId: userId },
      attributes: ['jobId']
    });

    const appliedJobIds = applied.map(app => app.jobId);

    // ✅ Fetch latest 4 jobs where candidate hasn't applied
    const jobs = await Job.findAll({
      where: {
        id: {
          [Op.notIn]: appliedJobIds.length > 0 ? appliedJobIds : [0] // fallback to [0] if empty
        },
        status: 'Open'
      },
      order: [['postedDate', 'DESC']],
      limit: 4
    });

    res.json(jobs);
  } catch (err) {
    console.error('Error fetching latest jobs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/logout', logoutUser);

export default router;
