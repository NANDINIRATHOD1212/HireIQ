import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../css/RecruiterProfile.css'; 
import NavBar from '../NavBar';
import BASE_URL from "../../api.js";
const RecruiterProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/recruiter/profile`, { withCredentials: true })
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <>
    <div className="profile-container">
      <h2>👤 Recruiter Profile</h2>
      <div className="profile-card">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
        <p><strong>Company:</strong> {profile.company || 'N/A'}</p>
         <p><strong>Experience:</strong> {profile.experience || 'N/A'}</p>
        <p><strong>Location:</strong> {profile.location || 'N/A'}</p>
        <p><strong>LinkedIn:</strong> {profile.linkedin || 'N/A'}</p>
        <p><strong>Bio:</strong> {profile.bio || 'N/A'}</p>

        <Link to="/recruiter/profile/edit" className="btn-edit">✏️ Edit Profile</Link>
      </div>
    </div>
    </>
  );
};

export default RecruiterProfile;
