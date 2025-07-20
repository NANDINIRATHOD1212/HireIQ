import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/CandidateProfile.css'; // CSS file
import BASE_URL from "../../api.js";
const CandidateProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE_URL}/candidate/profile`, { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          setUserData(res.data.user);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="center-text">Loading profile...</p>;
  if (!userData) return <p className="center-text">No profile data found.</p>;

  return (
    <div className="profile-container">
      <h2>👤 Candidate Profile</h2>

      <div className="profile-grid">
        <div className="row-block">
          <strong>Name:</strong>
          <span>{userData.name}</span>
        </div>

        <div className="row-block">
          <strong>Email:</strong>
          <span>{userData.email}</span>
        </div>

        <div className="row-block">
          <strong>Date of Birth:</strong>
          <span>{userData.dob ? new Date(userData.dob).toLocaleDateString() : '-'}</span>
        </div>

        <div className="row-block">
          <strong>Gender:</strong>
          <span>{userData.gender || '-'}</span>
        </div>

        <div className="row-block">
          <strong>Address:</strong>
          <span>{userData.address || '-'}</span>
        </div>

        <div className="row-block">
          <strong>Phone:</strong>
          <span>{userData.phone || '-'}</span>
        </div>

        <div className="row-block">
          <strong>LinkedIn:</strong>
          <span>
            {userData.linkedin ? (
              <a href={userData.linkedin} target="_blank" rel="noopener noreferrer">
                {userData.linkedin}
              </a>
            ) : '-'}
          </span>
        </div>

        <div className="row-block">
          <strong>GitHub:</strong>
          <span>
            {userData.github ? (
              <a href={userData.github} target="_blank" rel="noopener noreferrer">
                {userData.github}
              </a>
            ) : '-'}
          </span>
        </div>

        <div className="row-block">
          <strong>Education:</strong>
          <span>{userData.education || '-'}</span>
        </div>

        <div className="row-block">
          <strong>Experience:</strong>
          <span>{userData.experience || '-'}</span>
        </div>
      </div>

      <button className="edit-btn" onClick={() => navigate('/candidate/profile/update')}>
        ✏️ Edit Profile
      </button>
      <button className="edit-btn" onClick={() => navigate('/dashboard-candidate')}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default CandidateProfile;
