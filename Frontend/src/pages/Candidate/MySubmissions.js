import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/MySubmissions.css';

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get('http://localhost:3000/candidate/my-submissions', {
          withCredentials: true,
        });
        setSubmissions(res.data.submissions || []);
        if ((res.data.submissions || []).length === 0) {
          toast.info("No submissions found.");
        }
      } catch (err) {
        console.error('Error fetching submissions:', err);
        toast.error("Failed to load submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="container mt-5 submission-page">
      <ToastContainer />
      <h2 className="mb-4 text-center">📄 My Assessment Submissions</h2>

      {loading ? (
        <p className="text-center text-muted">⏳ Loading submissions...</p>
      ) : submissions.length === 0 ? (
        <p className="text-center text-muted">You haven't submitted any assessments yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover shadow-sm rounded bg-white">
            <thead className="table-primary">
              <tr>
                <th>Assessment</th>
                <th>Score</th>
                <th>Submitted On</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s, index) => (
                <tr key={index}>
                  <td>{s.title}</td>
                  <td>{s.totalScore}</td>
                  <td>{new Date(s.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MySubmissions;
