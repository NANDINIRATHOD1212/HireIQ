import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewScheduledInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:3000/recruiter/interviews', {
          withCredentials: true,  
        });
        if (response.data.success) {
          setInterviews(response.data.interviews);
        } else {
          setError('Failed to fetch interviews');
        }
      } catch (err) {
        setError('Error fetching interviews');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading) return <p>Loading interviews...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (interviews.length === 0) return <p>No interviews scheduled yet.</p>;

  return (
    <div className="container my-4">
      <h2>Scheduled Interviews</h2>
      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>Candidate Name</th>
            <th>Candidate Email</th>
            <th>Date</th>
            <th>Time</th>
            <th>Platform</th>
            <th>Interview Link</th>
          </tr>
        </thead>
        <tbody>
          {interviews.map((interview) => (
            <tr key={interview.id}>
              <td>{interview.candidate?.name || 'N/A'}</td>
              <td>{interview.candidate?.email || 'N/A'}</td>
              <td>{interview.date}</td>
              <td>{interview.time}</td>
              <td>{interview.platform}</td>
              <td>
                <a href={interview.link} target="_blank" rel="noopener noreferrer">
                  Join Interview
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewScheduledInterviews;
