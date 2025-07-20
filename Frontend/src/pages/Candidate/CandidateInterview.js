import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from "../../api.js";
const CandidateInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BASE_URL}/candidate/interviews`, { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          setInterviews(res.data.interviews);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching interviews:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading interviews...</p>;
  if (interviews.length === 0) return <p>No interviews scheduled.</p>;

  return (
    <div className="container my-5">
      <h2>📅 My Interviews</h2>
      <div className="list-group">
        {interviews.map(interview => (
          <div key={interview.id} className="list-group-item">
            <h5>Recruiter: {interview.recruiter?.name} ({interview.recruiter?.email})</h5>
            <p><strong>Date:</strong> {new Date(interview.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {interview.time}</p>
            <p><strong>Mode:</strong> {interview.mode}</p>
            <p><strong>Status:</strong> {interview.status}</p>
            {interview.link && (
              <p><strong>Link:</strong> <a href={interview.link} target="_blank" rel="noopener noreferrer">{interview.link}</a></p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateInterviews;
