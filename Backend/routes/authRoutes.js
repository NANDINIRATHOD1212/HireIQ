// ✅ routes/authRoutes.js
import express from 'express';
import passport from 'passport';
import {
  register, login, logout, sendResetOtp,
  verifyOtp, resetPassword
} from '../controllers/authController.js';
import User from '../models/User.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/logout', logout);
router.post('/send-reset-otp', sendResetOtp);
router.post('/reset-password', resetPassword);
router.post('/check-user', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.status(200).json({ name: user.name });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
});
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/signin',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  (req, res) => {
    req.session.user = req.user.get({ plain: true });
    console.log('Logged in user role:', req.user.role); 

    const role = req.user.role || 'candidate';
    console.log('Redirecting to dashboard of role:', role);

    res.redirect(`https://hireiq-frontend-v9nq.onrender.com/dashboard-${role}`);
  }
);


export default router;
