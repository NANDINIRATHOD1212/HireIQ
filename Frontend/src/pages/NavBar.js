 
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/RecruiterDashboard.css';
import Logout from './Recruiter/LogOut';

function NavBar() {
  return (
    <div className="sidebar bg-primary text-white p-4" style={{ width: '250px', minHeight: '100vh' }}>
      <div className="logo mb-4 fs-4">HireIQ</div>
      <Link to="/recruiter/profile" className="d-block text-white mb-2">✏️ Profile</Link>
      <Link to="/recruiter/post-job" className="d-block text-white mb-2">📄 Post a Job</Link>
      <Link to="/recruiter/view-jobs" className="d-block text-white mb-2">📋 View Posted Jobs</Link>
      <Link to="/recruiter/candidates" className="d-block text-white mb-2">👤 View Candidates</Link>
      <Link to="/recruiter/view-interviews" className="d-block text-white mb-2">📆 View Scheduled Interviews</Link>

      <hr className="bg-light" />

      <Link to="/recruiter/questions/manual" className="d-block text-white mb-2">📝 Add Questions (Manual)</Link>
      <Link to="/recruiter/questions/saved" className="d-block text-white mb-2">📋 View Saved Questions</Link>
      <Link to="/recruiter/questions/upload-pdf" className="d-block text-white mb-2">📄 Upload via PDF</Link>

       <Link to="/recruiter/generatefromai" className="d-block text-white mb-2">🧠Generate from Skills</Link>

      <hr className="bg-light" />

      <Link to="/recruiter/assessment-submissions" className="d-block text-white mb-2">📊 View Candidate Submissions</Link>

      <Logout />
    </div>
  );
}

export default NavBar; 