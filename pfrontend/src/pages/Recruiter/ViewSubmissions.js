import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewSubmissions() {
  const [assessments, setAssessments] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [updatedStatuses, setUpdatedStatuses] = useState({});

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get('http://localhost:3000/recruiter/assessment-submissions', {
          withCredentials: true,
        });

        setAssessments(res.data.assessments);
        setFilteredAssessments(res.data.assessments);
        setLoading(false);
      } catch (err) {
        console.error('Error loading submissions:', err);
        setError('❌ Failed to load assessment submissions.');
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);



  const handleStatusChange = (assessmentId, resultId, newStatus) => {
    setAssessments((prev) =>
      prev.map((assessment) =>
        assessment.id === assessmentId
          ? {
              ...assessment,
              AssessmentResults: assessment.AssessmentResults.map((result) =>
                result.id === resultId ? { ...result, status: newStatus } : result
              ),
            }
          : assessment
      )
    );
    setUpdatedStatuses((prev) => ({
    ...prev,
    [resultId]: newStatus,
  }));
  };

  // Save to DB
  const updateStatusInDB = async (resultId, status) => {
    try {
      await axios.post(
        'http://localhost:3000/recruiter/update-status',
        { resultId, status },
        { withCredentials: true }
      );
      alert('✅ Status updated!');
    } catch (err) {
      console.error('Update failed:', err);
      alert('❌ Error updating status.');
    }
  };

  // Filter option
  const handleFilterChange = (e) => {
    const selected = e.target.value;
    setStatusFilter(selected);

    if (selected === 'All') {
      setFilteredAssessments(assessments);
    } else {
      const filtered = assessments
        .map((assessment) => ({
          ...assessment,
          AssessmentResults: assessment.AssessmentResults.filter(
            (result) => result.status === selected
          ),
        }))
        .filter((a) => a.AssessmentResults.length > 0);

      setFilteredAssessments(filtered);
    }
  };

  return (
    <div className="container mt-4">
      <h3>📊 Assessment Submissions</h3>

      {/* 🔽 Status Filter Dropdown */}
      <div className="mb-3">
        <label className="form-label fw-bold">Filter by Status:</label>
        <select
          className="form-select w-25"
          value={statusFilter}
          onChange={handleFilterChange}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {loading && <p>⏳ Loading submissions...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && filteredAssessments.length === 0 && <p>No assessments found.</p>}

      {filteredAssessments.map((assessment) => (
        <div className="card mb-4 shadow-sm" key={assessment.id}>
          <div className="card-header">
            <strong>📘 {assessment.title}</strong> — Created on{' '}
            {new Date(assessment.createdAt).toLocaleDateString()}
          </div>

          <div className="card-body">
            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th>Candidate</th>
                  <th>Email</th>
                  <th>Score</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {assessment.AssessmentResults.map((result) => (
                  <tr key={result.id}>
                    <td>{result.User?.name || 'Unknown'}</td>
                    <td>{result.User?.email || 'N/A'}</td>
                    <td>{result.totalScore}</td>
                    <td>{new Date(result.createdAt).toLocaleString()}</td>
                    <td>
                      <select
                        className="form-select"
                        value={updatedStatuses[result.id] || result.status || 'Pending'}

                        onChange={(e) =>
                          handleStatusChange(assessment.id, result.id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => updateStatusInDB(result.id, updatedStatuses[result.id] || result.status)}

                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ViewSubmissions;
