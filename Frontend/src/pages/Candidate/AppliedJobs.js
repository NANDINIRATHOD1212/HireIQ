import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get('http://localhost:3000/candidate/applied-jobs', {
          withCredentials: true,
        });

        setAppliedJobs(res.data.applications || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching applied jobs:', err);
        setError('Failed to load applied jobs');
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">📌 Applied Jobs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : appliedJobs.length === 0 ? (
        <div className="alert alert-warning">You haven't applied to any jobs yet.</div>
      ) : (
        <div className="row">
          {appliedJobs.map((app, index) => (
            <div key={index} className="col-md-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{app.appliedJob?.title || 'Job Title'}</h5>
                  <p className="card-text"><strong>Description : </strong>{app.appliedJob?.description || 'No description available'}</p>
                  <p><strong>Company:</strong> {app.appliedJob?.recruiter?.name || 'N/A'}</p>
                  <p><strong>Requirements:</strong> {app.appliedJob?.skillsRequired || 'N/A'}</p>
                  <p><strong>Location:</strong> {app.appliedJob?.location || 'N/A'}</p>
                  <p><strong>Type:</strong> {app.appliedJob?.type || 'N/A'}</p>
                  <p className="text-muted">📅 Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
