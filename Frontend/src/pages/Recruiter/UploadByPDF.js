import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from "../../api.js";
const UploadByPDF = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState('');
  const [uploadedSet, setUploadedSet] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${BASE_URL}/recruiter/jobs`, { withCredentials: true })
      .then((res) => setJobs(res.data.jobs || []))
      .catch((err) => console.error('Failed to fetch jobs', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!title || !file || !selectedJobId) {
      setError('Title, Job, and PDF file are required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('pdf', file);
    formData.append('jobId', selectedJobId);

    try {
      const res = await axios.post(
        `${BASE_URL}/recruiter/questions/upload-pdf`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (res.data.success) {
        setMessage(res.data.message);
        setUploadedSet(res.data.questionSet);
        setTitle('');
        setFile(null);
        setSelectedJobId('');
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload error. Are you logged in?');
    }
  };

  return (
    <div className="container mt-4">
      <h3>📄 Upload Question Set via PDF</h3>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Set Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Select Job</label>
          <select
            className="form-select"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
          >
            <option value="">-- Select Job --</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Upload PDF</label>
          <input
            type="file"
            className="form-control"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Upload</button>
      </form>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {uploadedSet && (
        <div className="card mt-4">
          <div className="card-header">
            <strong>{uploadedSet.title}</strong> (ID: {uploadedSet.id})<br />
            <small className="text-muted">
              Created on {new Date(uploadedSet.createdAt).toLocaleString()}
            </small>
          </div>
          <ul className="list-group list-group-flush">
            {JSON.parse(uploadedSet.questions).map((q, i) => (
              <li key={i} className="list-group-item">
                <strong>Q:</strong> {q.question} <br />
                <strong>A:</strong> {q.answer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadByPDF;
