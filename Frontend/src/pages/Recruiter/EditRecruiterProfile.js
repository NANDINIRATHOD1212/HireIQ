import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/RecruiterProfile.css'; 
import NavBar from '../NavBar';
import { useNavigate } from 'react-router-dom';

const EditRecruiterProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    location: '',
    bio: '',
    linkedin: '',
    experience:''
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/recruiter/profile', { withCredentials: true })
      .then(res => {
        const { name, phone, company, location, bio, linkedin,experience} = res.data;
        setFormData({ name, phone, company, location, bio, linkedin,experience });
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put('http://localhost:3000/recruiter/profile', formData, { withCredentials: true })
      .then(() => {
        alert("Profile updated successfully");
        navigate('/recruiter/profile');
      })
      .catch(() => alert("Update failed"));
  };

  return (
    <div className="edit-profile-container">
      <h2>✏️ Edit Profile</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        {["name", "phone", "company", "location", "linkedin","experience"].map((field) => (
          <div key={field} className="form-group">
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className="form-group">
          <label>Bio:</label>
          <textarea
            name="bio"
            rows="4"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn-save">💾 Save Changes</button>
      </form>
    </div>
  );
};

export default EditRecruiterProfile;
