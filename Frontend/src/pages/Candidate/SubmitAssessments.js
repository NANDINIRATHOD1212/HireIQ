import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from "../../api.js";
const SubmittedAssessments = () => {
  const [submitted, setSubmitted] = useState({});

  useEffect(() => {
    axios.get(`${BASE_URL}/candidate/my-assessments`, { withCredentials: true })
      .then(res => setSubmitted(res.data.assessments || {}))
      .catch(err => console.error('Error loading submitted assessments:', err));
  }, []);

  return (
    <div className="container mt-4">
      <h3>📊 My Submitted Assessments</h3>
      {Object.keys(submitted).length === 0 ? (
        <p className="text-muted">No assessments submitted yet.</p>
      ) : (
        Object.entries(submitted).map(([id, set]) => (
          <div key={id} className="mb-4">
            <h5>{set.title}</h5>
            <ul className="list-group">
              {set.questions.map((q, idx) => (
                <li key={idx} className="list-group-item">
                  <strong>Q:</strong> {q.question}<br />
                  <strong>Your Answer:</strong> {q.answer}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default SubmittedAssessments;
