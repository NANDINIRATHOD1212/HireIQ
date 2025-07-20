import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../../css/ScheduleInterview.css';

const ScheduleInterview = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [form, setForm] = useState({
    candidateId: '',
    date: '',
    time: '',
    platform: '',
    link: ''
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) {
      navigate('/dashboard-recruiter');
      return;
    }

    axios.get(`http://localhost:3000/recruiter/applicants/${jobId}`, {
      withCredentials: true
    })
      .then(res => {
        if (res.data.success && Array.isArray(res.data.applications)) {
          const applicants = res.data.applications
            .map(app => app.candidate)
            .filter(c => c);
          setCandidates(applicants);
        } else {
          setCandidates([]);
        }
      })
      .catch(() => setCandidates([]))
      .finally(() => setLoading(false));
  }, [jobId, navigate]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.candidateId || !form.date || !form.time || !form.platform || !form.link ||!form.venue) {
      setMessage({ type: 'danger', text: 'Please fill all fields.' });
      return;
    }
    try {
      const res = await axios.post('http://localhost:3000/recruiter/schedule', {
        ...form,
        jobId,
      }, { withCredentials: true });
      setMessage({ type: 'success', text: res.data.message || 'Interview scheduled successfully!' });
      setForm({ candidateId: '', date: '', time: '', platform: '', link: '' ,venue:'' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to schedule interview.' });
    }
  };

  return (
    <div className="container my-5 schedule-box">
      <h2 className="mb-4">📅 Schedule Interview</h2>

      {message && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border rounded bg-light shadow-sm">
        <div className="mb-3">
          <label className="form-label">Select Candidate</label>
          <select
            className="form-select"
            name="candidateId"
            value={form.candidateId}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">-- Select --</option>
            {loading ? (
              <option disabled>Loading candidates...</option>
            ) : candidates.length === 0 ? (
              <option disabled>No candidates available</option>
            ) : (
              candidates.map(c => (
                <option key={c.id || c._id} value={c.id || c._id}>
                  {c.name} ({c.email})
                </option>
              ))
            )}
          </select>
        </div>

        <div className="row">
          <div className="mb-3 col-md-6">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              className="form-control"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 col-md-6">
            <label className="form-label">Time</label>
            <input
              type="time"
              name="time"
              className="form-control"
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Platform</label>
          <input
            type="text"
            name="platform"
            className="form-control"
            value={form.platform}
            onChange={handleChange}
            placeholder="Zoom / Google Meet / MS Teams"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Interview Link</label>
          <input
            type="url"
            name="link"
            className="form-control"
            value={form.link}
            onChange={handleChange}
            placeholder="https://meet.google.com/xyz"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Venue</label>
          <input
            type="text"
            name="venue"
            className="form-control"
            value={form.venue}
            onChange={handleChange}
            placeholder="Address"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!form.candidateId || loading}
        >
          Schedule Interview
        </button>
      </form>

    
    </div>
  );
};

export default ScheduleInterview;
