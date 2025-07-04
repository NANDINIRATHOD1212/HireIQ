// ✅ routes/authRoutes.js
import express from 'express';
import passport from 'passport';
import {
  register, login, logout, sendResetOtp,
  verifyOtp, resetPassword
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/logout', logout);
router.post('/send-reset-otp', sendResetOtp);
router.post('/reset-password', resetPassword);

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

    res.redirect(`http://localhost:3001/dashboard-${role}`);
  }
);


export default router;
