import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/ViewPost.css';

const ViewPostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/recruiter/view-jobs', {
        withCredentials: true,
      });

      if (response.data.success && response.data.jobs.length > 0) {
        setJobs(response.data.jobs);
        toast.success('Jobs loaded successfully!');
      } else {
        setJobs([]);
        toast.info('No jobs found.');
      }
    } catch (err) {
      toast.error('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleInterview = (jobId) => {
    toast.info('Redirecting to schedule page...');
    navigate(`/recruiter/schedule/${jobId}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📝 Your Posted Jobs</h2>
      {loading ? (
        <p className="text-center mt-5">⏳ Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-center">No jobs posted yet.</p>
      ) : (
        <div className="row">
          {jobs.map((job) => (
            <div className="col-md-6 mb-4" key={job.id || job._id}>
              <div className="card shadow-sm p-4">
                <h5>{job.title} @ {job.company || 'Company'}</h5>
                <p><strong>📝 Description:</strong> {job.description}</p>
                <p><strong>📍 Location:</strong> {job.location}</p>
                <p><strong>💼 Type:</strong> {job.type}</p>
                <p><strong>💰 Salary:</strong> ₹{job.salary || 'N/A'}</p>
                
                <p><strong>🧠 Requirements:</strong> {job.skillsRequired}</p>
                <p><strong>📅 Posted on:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>

                <button
                  className="btn btn-primary mt-3"
                  onClick={() => handleScheduleInterview(job.id || job._id)}
                >
                  📆 Schedule Interview
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ViewPostedJobs;
