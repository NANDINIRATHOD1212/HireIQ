import User from '../models/User.js';
import bcrypt from 'bcrypt';
import sendVerificationEmail from '../utils/sendEmail.js';
import sendResetEmail from '../utils/sendResetEmail.js';
import otpGenerator from 'otp-generator';
import crypto from 'crypto';

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Email already registered',
        botMessage: 'Oops! Looks like this email is already registered. Did you forget your password?'
      });
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const newUser = await User.create({
      name,
      email,
      password,
      role,
      isVerified: false,
      otp,
      otpExpiry: new Date(Date.now() + 5 * 60 * 1000), 
    });

    await sendVerificationEmail(email, name, otp);

    res.status(200).json({
      success: true,
      message: 'Registered successfully! Check your email for OTP.',
      botMessage: `Hey ${name}, you're almost there! I've sent an OTP to your email. Please check your inbox and verify your account.`
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      botMessage: 'Sorry, something went wrong during registration. Please try again later.'
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ 
      error: 'User not found',
      botMessage: 'Hmm, I couldn’t find your account. Are you sure you registered?'
    });
    if (user.isVerified) return res.status(400).json({ 
      error: 'User already verified',
      botMessage: 'Your email is already verified. You can log in now!'
    });
    if (user.otp !== otp) return res.status(400).json({ 
      error: 'Invalid OTP',
      botMessage: 'That OTP doesn’t seem correct. Please check and try again.'
    });

    const now = Date.now();
    const otpExpiryTime = new Date(user.otpExpiry).getTime();
    if (now > otpExpiryTime) {
      return res.status(400).json({ 
        error: 'OTP expired',
        botMessage: 'The OTP has expired. Please request a new one.'
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Email verified successfully',
      botMessage: 'Great! Your email has been verified. You can now log in.'
    });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ 
      error: 'OTP verification failed',
      botMessage: 'Oops, I had trouble verifying your OTP. Please try again.'
    });
  }
};


export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ 
        error: 'Email not found',
        botMessage: 'We couldn’t find any account with that email.'
      });
    }

   
    const otp = crypto.randomInt(100000, 999999).toString();

    user.resetOtp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

    
    await user.save();

    await sendResetEmail(email, otp);

    res.status(200).json({ 
      message: 'OTP sent to your email',
      botMessage: 'Check your email for the password reset OTP.'
    });
  } catch (err) {
    console.error('Send Reset OTP Error:', err);
    res.status(500).json({ 
      error: 'Failed to send OTP',
      botMessage: 'Sorry, we could not send the OTP. Please try again later.'
    });
  }
};


export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    
    if (user.resetOtp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    const now = Date.now();
    const otpExpiryTime = new Date(user.otpExpiry).getTime();
    if (now > otpExpiryTime) {
      return res.status(400).json({ 
        error: 'OTP expired',
        botMessage: 'The OTP has expired. Please request a new one.'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = null; 
    user.otpExpiry = null;
    await user.save();

    return res.json({ 
      message: 'Password reset successfully. You can now log in.',
      botMessage: 'Your password has been updated successfully.'
    });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ 
      error: 'User not found',
      botMessage: "I couldn't find an account with that email. Would you like to register?"
    });

    if (!user.isVerified) {
      return res.status(401).json({ 
        error: 'Email not verified. Please check your inbox.',
        botMessage: 'Your email is not verified yet. Please check your inbox for the OTP.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        error: 'Invalid email or password',
        botMessage: 'Hmm, the email or password you entered is incorrect. Want me to help you reset it?'
      });
    }

  
    const freshUser = await User.findByPk(user.id);


    req.session.user = freshUser.get({ plain: true });

    res.status(200).json({
      message: 'Login successful',
      user: req.session.user,
      botMessage: `Welcome back, ${user.name}! How can I assist you today?`
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      botMessage: 'Sorry, something went wrong while logging you in. Please try again later.'
    });
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ 
      message: 'Logged out successfully',
      botMessage: 'You have been logged out. See you soon!'
    });
  });
};
