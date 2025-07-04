import express from 'express';
import { isCandidate } from '../middleware/authMiddleware.js';
import {
  showAvailableAssessments,
  viewSubmittedAnswers
} from '../controllers/candidateAssessmentController.js';

import { renderAssessmentForm,submitAssessment,getMySubmissions} from '../controllers/assessmentController.js';
const router = express.Router();


router.get('/candidate/assessments', isCandidate, showAvailableAssessments);

router.get('/candidate/my-assessments', isCandidate, viewSubmittedAnswers);

router.get('/candidate/assessment/:id', isCandidate, renderAssessmentForm);

router.post('/candidate/assessment/:id', isCandidate, submitAssessment);
router.get('/candidate/my-submissions', isCandidate, getMySubmissions);

export default router;

