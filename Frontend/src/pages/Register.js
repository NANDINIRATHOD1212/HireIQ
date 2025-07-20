import React, { useState, useEffect } from 'react';
import '../css/Register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import BASE_URL from '../api.js';
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '' });
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState('register');
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const registerFields = ['name', 'email', 'password', 'role'];

  const addMessage = (text, from = 'bot') => {
    setMessages(prev => [...prev, { text, from }]);
  };

  const handleInput = (value) => {
    if (!value.trim()) return;
    addMessage(value, 'user');

    if (step === 'register') handleRegisterInput(value.trim());
    else if (step === 'otp') handleOtpInput(value.trim());

    setInputValue('');
  };

  const handleRegisterInput = (value) => {
    const field = registerFields[currentFieldIndex];

    if (field === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      addMessage('Please enter a valid email address.');
      return;
    }
if (field === 'role') {
  const roles = ['admin', 'recruiter', 'candidate'];
  const normalized = value.trim().toLowerCase();

  if (!roles.includes(normalized)) {
    addMessage('Please enter a valid role: admin, recruiter, or candidate.');
    return;
  }

  setFormData(prev => ({ ...prev, [field]: normalized }));
}
else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    if (currentFieldIndex + 1 < registerFields.length) {
      const nextField = registerFields[currentFieldIndex + 1];
      addMessage(`Please enter your ${nextField}.`);
      setCurrentFieldIndex(currentFieldIndex + 1);
    } else {
      submitRegister();
    }
  };

  const submitRegister = async () => {
  if (!formData.role || !['admin', 'recruiter', 'candidate'].includes(formData.role)) {
    addMessage('Please select a valid role before proceeding.', 'bot');
    setCurrentFieldIndex(registerFields.indexOf('role'));
    return;
  }

  addMessage('Registering your account...', 'bot');

  try {
    const res = await axios.post(`${BASE_URL}/auth/register`, formData, {
      withCredentials: true,
    });
    addMessage(res.data.message, 'bot');
    addMessage('Please enter the 6-digit OTP sent to your email.', 'bot');
    setStep('otp');
  } catch (error) {
    const errMsg = error.response?.data?.error || 'Something went wrong. Try again.';
    addMessage(errMsg, 'bot');
    setCurrentFieldIndex(0);
    addMessage("Let's try again. Please enter your name.", 'bot');
  }
};

  const handleOtpInput = async (otp) => {
    if (otp.length !== 6) {
      addMessage('OTP must be 6 digits.');
      return;
    }

    addMessage('Verifying OTP...');
    try {
      const res = await axios.post(`${BASE_URL}/auth/verify-otp`, { email: formData.email, otp }, { withCredentials: true });
      addMessage(res.data.botMessage || res.data.message);
      addMessage('You can now login.');
      setStep('done');
    } catch (error) {
      const errMsg = error.response?.data?.botMessage || 'OTP verification failed.';
      addMessage(errMsg);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleInput(inputValue);
  };

  useEffect(() => {
    if (messages.length === 0) {
      addMessage('Welcome! Let\'s get you registered. Please enter your name.');
    }
  }, []);

  return (
    <div className="chatbot-login-page">
      <div className="chatbot-login-box">
        <h2 className="text-center mb-3">
          Register to <span className="brand-name">HireIQ</span>
        </h2>

        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chatbot-message ${msg.from === 'bot' ? 'bot-message' : 'user-message'}`}>
              {msg.text}
            </div>
          ))}
        </div>

        {(step === 'register' || step === 'otp') && (
          <>
            <form onSubmit={handleSubmit} className="chatbot-input-form">
              <input
                type={registerFields[currentFieldIndex] === 'password' ? 'password' : 'text'}
                className="chatbot-input"
                placeholder={step === 'otp' ? 'Enter OTP...' : 'Type here...'}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                autoFocus
                required
              />
              <button type="submit" className="chatbot-submit-btn">Send</button>
            </form>
            <button
              className="chatbot-submit-btn back-btn"
              onClick={() => navigate('/')}
            >
              Back to Dashboard
            </button>
          </>
        )}

        {step === 'done' && (
          <div className="text-center mt-3">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => navigate('/')}
              style={{ marginTop: '15px', width: '100%' }}
            >
              Back to Dashboard
            </button>
             
          </div>
        )}
        <Link style = {{margin:'20px',color:'black'}} to="/login">Already have an account ?   Login Now...</Link>
      </div>
    </div>
  );
};

export default Register;
