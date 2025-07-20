import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../css/ViewCandidates.css';

const ViewCandidates = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/recruiter/candidates', { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setCandidates(res.data.candidates);
        }
      })
      .catch((err) => console.error('Error fetching candidates:', err));
  }, []);

  return (
    <div className="container my-5 view-candidates">
      <h2 className="mb-4 text-center">📋 Candidate List</h2>

      {candidates.length === 0 ? (
        <div className="alert alert-info text-center">No candidates available yet.</div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-striped table-bordered align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Resume</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>{candidate.name}</td>
                  <td>{candidate.email}</td>
                  <td>
                    {candidate.resume?.filePath ? (
                      <a
                        href={`http://localhost:3000/${candidate.resume.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-success"
                      >
                        📄 View Original
                      </a>
                    ) : (
                      <span className="text-muted fst-italic">No resume uploaded</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="d-flex justify-content-center mt-4">

      </div>
    </div>
  );
};

export default ViewCandidates;
