// routes/dashboardRoutes.js

import express from 'express';
import { isAdmin, isRecruiter, isCandidate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin/dashboard', isAdmin, (req, res) => {
  res.json({ message: 'Welcome to Admin Dashboard' });
});

router.get('/recruiter/dashboard', isRecruiter, (req, res) => {
  res.json({ message: 'Welcome to Recruiter Dashboard' });
});

router.get('/candidate/dashboard', isCandidate, (req, res) => {
  res.json({ message: 'Welcome to Candidate Dashboard' });
});

export default router;
