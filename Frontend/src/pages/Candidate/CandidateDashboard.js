import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/CandidateDashboard.css';
import BASE_URL from "../../api.js";
const CandidateDashboard = () => {
  const [latestJobs, setLatestJobs] = useState([]);
  const [user, setUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appliedJobs, setAppliedJobs] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const resumeRes = await axios.get(`${BASE_URL}/resume`, { withCredentials: true });
        const jobsRes = await axios.get(`${BASE_URL}/candidate/latest`, { withCredentials: true });

        setUser(resumeRes.data.user || {});
        setLatestJobs(jobsRes.data || []);

        const appliedMap = {};
        (jobsRes.data || []).forEach(job => {
          if (job.isApplied) {
            appliedMap[job.id] = true;
          }
        });
        setAppliedJobs(appliedMap);

        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleApply = async (jobId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/candidate/apply/${jobId}`,
        {},
        { withCredentials: true }
      );
      setAppliedJobs(prev => ({ ...prev, [jobId]: true }));
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Error applying to job';
      setMessage(errMsg);
      if (err.response?.status === 400) {
        setAppliedJobs(prev => ({ ...prev, [jobId]: true }));
      }
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-9 p-4">
          <div className="dashboard-header mb-4">
            <h2>🙋 Welcome, {user.name} ({user.email})</h2>
            <p className="text-muted">
              This is your personalized dashboard. Explore the latest job opportunities below.
            </p>
          </div>

          {message && <div className="alert alert-info">{message}</div>}

          <div className="latest-jobs bg-white p-4 rounded shadow-sm">
            <h5 className="mb-3">📌 Latest Job Openings</h5>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : latestJobs.length > 0 ? (
              <ul className="list-group">
                {latestJobs.map(job => (
                  <li key={job.id} className="list-group-item">
                    <h4>{job.title}</h4>
                    <p className="mb-1"><strong>Company:</strong> {job.company}</p>
                    <p className="mb-1"><strong>Location:</strong> {job.location}</p>
                    <p className="mb-1"><strong>Salary:</strong> {job.salary || 'N/A'}</p>
                    <small className="text-muted">Posted on: {new Date(job.postedDate).toLocaleDateString()}</small>
                    <br />
                    <button
                      className="btn btn-sm btn-outline-primary mt-2"
                      onClick={() => handleApply(job.id)}
                      disabled={appliedJobs[job.id]}
                    >
                      {appliedJobs[job.id] ? '✅ Applied' : 'Apply Now'}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No job postings available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
