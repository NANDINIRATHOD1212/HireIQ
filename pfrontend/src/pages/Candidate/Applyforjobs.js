import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApplyForJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // API changed to get jobs with applied status
        const res = await axios.get('http://localhost:3000/candidate/jobs-with-status', { withCredentials: true });

        const jobsData = res.data.jobs || [];
        setJobs(jobsData);

        // Map jobs to appliedJobs state for quick lookup
        const appliedMap = {};
        jobsData.forEach(job => {
          if (job.isApplied) {
            appliedMap[job.id] = true;
          }
        });
        setAppliedJobs(appliedMap);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setMessage('Failed to load jobs');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/candidate/apply/${jobId}`,
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
    <div className="container py-4">
      <h2 className="mb-4">💼 Browse Available Jobs</h2>
      {message && <div className="alert alert-info">{message}</div>}
      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <div className="row">
          {jobs.map((job) => (
            <div className="col-md-6 mb-4" key={job.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{job.title}</h5>
                  <p><strong>Company:</strong> {job.company}</p>
                  <p className="card-text"><strong>Description:</strong>{job.description}</p>
                  <p><strong>Skills Required:</strong> {job.skillsRequired}</p>
                  <p><strong>Salary:</strong> {job.salary}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Type:</strong> {job.type}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleApply(job.id)}
                    disabled={appliedJobs[job.id]}
                  >
                    {appliedJobs[job.id] ? '✅ Applied' : 'Apply Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplyForJobs;
