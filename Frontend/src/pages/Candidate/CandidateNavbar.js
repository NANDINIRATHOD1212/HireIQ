import React from 'react';
import { Link } from 'react-router-dom';
import Logout from '../Recruiter/LogOut';
import BASE_URL from "../../api.js";
const CandidateNavbar = () => {
  return (
    <div className="col-md-3 sidebar bg-primary vh-100 border-end pt-4">
      <div className="logo mb-4 px-3 fw-bold text-white fs-4">HireIQ</div>
      <Link to="/candidate/dashboard-candidate" className="d-block px-3 py-2 text-decoration-none text-white fw-medium">📊 Dashboard</Link>
      <Link to="/candidate/profile" className="d-block px-3 py-2 text-decoration-none text-white fw-medium">👤 Profile</Link>
      <Link to="/candidate/interviews" className="d-block px-3 py-2 text-decoration-none text-white fw-medium">📅 My Interviews</Link>
      <Link to="/candidate/upload-resume" className="d-block px-3 py-2 text-decoration-none text-white fw-medium">📄 Upload Resume</Link>
      <Link to="/candidate/jobs" className="d-block px-3 py-2 text-decoration-none text-white fw-medium">💼 Browse & Apply Jobs</Link>
      <Link to="/candidate/assessments" className="d-block px-3 py-2 text-decoration-none text-white fw-medium">📝 Take Assessment</Link>
      <Link to="/candidate/applied-jobs" className="d-block px-3 py-2 text-decoration-none text-white fw-medium">📌 Applied Jobs</Link>
      <Link to="/candidate/my-submissions" className="d-block px-3 py-2 text-decoration-none text-white fw-medium">📊 My Submissions</Link>
      <Logout />
    </div>
  );
};

export default CandidateNavbar;
