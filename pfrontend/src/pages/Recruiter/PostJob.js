import React, { useState } from 'react';
import '../../css/PostJob.css';
import axios from 'axios';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    salary: '',
    description: '',
    requirements: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
  const response = await axios.post('http://localhost:3000/recruiter/post-job', formData, {
    withCredentials: true
  });

  alert(response.data.message);
} catch (err) {
  if (err.response && err.response.data) {
    alert(err.response.data.message); 
  } else {
    alert('Failed to post job');
  }
}

  };

  return (
    <div className="postjob-bg d-flex align-items-center justify-content-center vh-100">
      <div className="postjob-card shadow-lg p-5 bg-white rounded">
        <h1 className="text-center mb-4 postjob-heading">
          🚀 Post a New Job on <span className="highlight">HireIQ</span>
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label">🔖 Job Title</label>
              <input type="text" name="title" className="form-control" onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">🏢 Company</label>
              <input type="text" name="company" className="form-control" onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">📍 Location</label>
              <input type="text" name="location" className="form-control" onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">💼 Job Type</label>
              <select name="type" className="form-select" onChange={handleChange} required>
                <option value="">Select Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">💰 Salary (per annum)</label>
              <input type="text" name="salary" className="form-control" onChange={handleChange} />
            </div>
            <div className="col-12">
              <label className="form-label">📝 Job Description</label>
              <textarea name="description" className="form-control" rows="3" onChange={handleChange} required />
            </div>
            <div className="col-12">
              <label className="form-label">📌 Requirements</label>
              <textarea name="requirements" className="form-control" rows="3" onChange={handleChange} required />
            </div>
            <div className="col-12 text-center mt-4">
              <button type="submit" className="btn btn-postjob">📤 Post Job</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
