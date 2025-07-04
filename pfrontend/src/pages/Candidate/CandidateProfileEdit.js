import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Particles from 'react-tsparticles';

import '../../css/CandidateProfileEdit.css';  // Import the CSS file

const CandidateProfileEdit = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    gender: '',
    address: '',
    phone: '',
    linkedin: '',
    github: '',
    education: '',
    experience: ''
  });

  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/candidate/profile', { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          setFormData(res.data.user);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:3000/candidate/profile/update', formData, { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          setSuccessMsg('Profile updated successfully!');
          setTimeout(() => {
            navigate('/candidate/profile');
          }, 1500);
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-edit-container">
      {/* Particles Background */}
      <Particles
        options={{
          fullScreen: { enable: false },
          background: { color: "#0d47a1" },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" }
            },
            modes: {
              repulse: { distance: 100, duration: 0.4 },
              push: { quantity: 4 }
            }
          },
          particles: {
            color: { value: "#ffffff" },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            collisions: { enable: false },
            move: {
              direction: "none",
              enable: true,
              outModes: "bounce",
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: { enable: true, area: 800 },
              value: 50,
            },
            opacity: { value: 0.4 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 4 } },
          },
          detectRetina: true,
        }}
        className="particles-background"
      />

      {/* Form Container */}
      <div className="profile-edit-form-container">
        <h2>👤 Edit Profile</h2>
        {successMsg && <div className="success-msg">{successMsg}</div>}
        <form onSubmit={handleSubmit} className="profile-edit-form">
          {[
            { label: "Name", name: "name", type: "text", required: true, className: "form-group" },
            { label: "Email", name: "email", type: "email", required: true, className: "form-group" },
            { label: "Date of Birth", name: "dob", type: "date", required: false, className: "form-group" },
            {
              label: "Gender", name: "gender", type: "select", required: false, className: "form-group", options: ["", "Male", "Female", "Other"]
            },
            { label: "Address", name: "address", type: "textarea", required: false, className: "form-group full-width" },
            { label: "Phone", name: "phone", type: "text", required: false, className: "form-group" },
            { label: "LinkedIn", name: "linkedin", type: "text", required: false, className: "form-group" },
            { label: "GitHub", name: "github", type: "text", required: false, className: "form-group" },
            { label: "Education", name: "education", type: "textarea", required: false, className: "form-group" },
            { label: "Experience", name: "experience", type: "textarea", required: false, className: "form-group full-width" },
          ].map(({ label, name, type, required, className, options }) => (
            <div key={name} className={className}>
              <label>{label}</label>
              {type === "textarea" ? (
                <textarea
                  name={name}
                  value={formData[name] || ''}
                  onChange={handleChange}
                  required={required}
                />
              ) : type === "select" ? (
                <select
                  name={name}
                  value={formData[name] || ''}
                  onChange={handleChange}
                  required={required}
                >
                  {options.map((opt, i) => (
                    <option key={i} value={opt}>{opt === "" ? "Select" : opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  name={name}
                  value={formData[name] || ''}
                  onChange={handleChange}
                  required={required}
                />
              )}
            </div>
          ))}
          <button type="submit" className="submit-btn">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default CandidateProfileEdit;
