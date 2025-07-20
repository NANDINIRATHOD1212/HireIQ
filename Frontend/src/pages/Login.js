import React, { useState } from 'react';
import '../css/Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice.js';
import { Link } from 'react-router-dom';
import BASE_URL from '../api.js';
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [messages, setMessages] = useState([
    { text: 'Hi! Please enter your email.', from: 'bot' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState('email');

  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  const addMessage = (text, from) => {
    setMessages(prev => [...prev, { text, from }]);
  };

  const handleUserInput = async (value) => {
    if (!value.trim()) return;

    addMessage(value, 'user');

    const normalizedInput = value.toLowerCase().replace(/\s+/g, '');
    const forgotPasswordPattern = /^forgotpassword$/;

    if (forgotPasswordPattern.test(normalizedInput)) {
      addMessage('Please enter your registered email for password reset.', 'bot');
      setStep('forgot_email');
      setInputValue('');
      return;
    }

    switch (step) {
      case 'email':
        setFormData(prev => ({ ...prev, email: value.trim() }));
        addMessage('Thanks! Now enter your password.', 'bot');
        setStep('password');
        break;

      case 'password':
        setFormData(prev => ({ ...prev, password: value.trim() }));
        await attemptLogin({ ...formData, password: value.trim() });
        break;

      case 'forgot_email':
        setResetEmail(value.trim());
        try {
          const res = await axios.post(
            `${BASE_URL}/auth/send-reset-otp`,
            { email: value.trim() },
            { withCredentials: true }
          );
          addMessage(res.data.message, 'bot');
          addMessage('Please enter the OTP sent to your email.', 'bot');
          setStep('otp');
        } catch (err) {
          addMessage(err.response?.data?.error || 'Email not found.', 'bot');
        }
        break;

      case 'otp':
        setResetOtp(value.trim());
        addMessage('Now enter your new password.', 'bot');
        setStep('new_password');
        break;

      case 'new_password':
        setNewPassword(value.trim());
        try {
          const res = await axios.post(
            `${BASE_URL}/auth/reset-password`,
            {
              email: resetEmail,
              otp: resetOtp,
              newPassword: value.trim(),
            },
            { withCredentials: true }
          );
          addMessage(res.data.message, 'bot');
          addMessage('You can now log in again. Please enter your email.', 'bot');
          setStep('email');
          setFormData({ email: '', password: '' });
        } catch (err) {
          addMessage(err.response?.data?.error || 'OTP verification failed.', 'bot');
        }
        break;

      default:
        addMessage('Please enter your email to continue.', 'bot');
        setStep('email');
        break;
    }

    setInputValue('');
  };

  const attemptLogin = async (data) => {
    addMessage('Logging you in...', 'bot');
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, data, { withCredentials: true });
      addMessage(res.data.message, 'bot');

      const user = res.data.user;
      dispatch(loginUser(user));

      setTimeout(() => {
        if (user.role === 'admin') navigate('/dashboard-admin');
        else if (user.role === 'recruiter') navigate('/recruiter/dashboard-recruiter');
        else navigate('/candidate/dashboard-candidate');
      }, 1500);
    } catch (error) {
      const errMsg = error.response?.data?.error || error.response?.data?.message || 'Something went wrong';
      addMessage(errMsg, 'bot');
      addMessage('Type "forgot password" if you want to reset it.', 'bot');
      addMessage('Or try again. Please enter your email.', 'bot');
      setStep('email');
      setFormData({ email: '', password: '' });
    }
  };

  const handleGoogleLogin = () => {
    window.open(`${BASE_URL}/auth/google`, '_self');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUserInput(inputValue);
  };

  return (
    <div className="chatbot-login-page">
      <div className="chatbot-login-box">
        <h2 className="text-center mb-3">
          Login to <span className="brand-name">HireIQ</span>
        </h2>

        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chatbot-message ${msg.from === 'bot' ? 'bot-message' : 'user-message'}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="chatbot-input-form">
          <input
            type={step === 'password' || step === 'new_password' ? 'password' : 'text'}
            className="chatbot-input"
            placeholder="Type your response..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            autoFocus
            autoComplete="off"
            required
          />
          <button type="submit" className="chatbot-submit-btn">Send</button>
        </form>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="chatbot-submit-btn google-btn"
        >
          Sign in with Google
        </button>

        <button
          type="button"
          onClick={() => navigate('/')}
          style={{ marginTop: '15px', width: '100%' }}
          className="chatbot-submit-btn back-btn"
        >
          Back to dashboard
        </button>

        <Link
          style={{ alignItems: 'center', justifyContent: 'center', margin: '20px', color: 'black' }}
          to="/register"
        >
          Don't have an account? Register Now...
        </Link>
      </div>
    </div>
  );
};

export default Login;
