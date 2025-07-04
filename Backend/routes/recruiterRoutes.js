// routes/recruiterRoutes.js
import express from 'express';
import JobApplication from '../models/JobApplication.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import { isRecruiter } from '../middleware/authMiddleware.js';

import {
  scheduleInterview,

  getCandidatesWithResume,
  postJob,
  getApplicantsForJob,
  getJobById,
  updateJob,
  deleteJob,
   updateAssessmentStatus,
  viewAssessmentSubmissions,
  viewPostedJobs,
  getRecruiterInterviews,
  getProfile,
  updateProfile,
  getJobs

} from '../controllers/recruiterController.js';


const router = express.Router();

router.get('/recruiter/candidates', isRecruiter, getCandidatesWithResume);
router.post('/recruiter/schedule', isRecruiter, scheduleInterview);
router.get('/recruiter/interviews', isRecruiter, getRecruiterInterviews);
router.post('/recruiter/post-job', isRecruiter, postJob);
router.get('/recruiter/view-jobs', isRecruiter, viewPostedJobs);
router.get('/recruiter/applicants/:jobId', isRecruiter, getApplicantsForJob);
router.get('/recruiter/edit-job/:id', isRecruiter, getJobById);
router.post('/recruiter/edit-job/:id', isRecruiter, updateJob);
router.post('/recruiter/delete-job/:id', isRecruiter, deleteJob);
router.get('/recruiter/assessment-submissions', viewAssessmentSubmissions);
router.get('/recruiter/jobs', isRecruiter, getJobs);
router.post('/recruiter/update-status', updateAssessmentStatus);
router.get('/recruiter/profile', getProfile);
router.put('/recruiter/profile', updateProfile);
export default router;
