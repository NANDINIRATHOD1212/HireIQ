import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:3000/admin/jobs',{withCredentials:true});
      setJobs(res.data);
    } catch (err) {
      alert('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await axios.delete(`http://localhost:3000/admin/jobs/${id}`,{withCredentials:true});
      setJobs(jobs.filter(job => job.id !== id));
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  const handleEditClick = (job) => {
    setEditingJobId(job.id);
    setEditData({
      ...job,
      postedDate: job.postedDate ? job.postedDate.split('T')[0] : ''
    });
  };

  const handleCancelEdit = () => {
    setEditingJobId(null);
    setEditData({});
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedData = {
        ...editData,
        postedDate: new Date(editData.postedDate).toISOString()
      };
      await axios.put(`http://localhost:3000/admin/jobs/${editingJobId}`, updatedData,{withCredentials:true});
      setEditingJobId(null);
      setEditData({});
      fetchJobs();
    } catch (err) {
      alert('Failed to update job');
    }
  };

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div className="container py-4">
      <h2>Job Management</h2>
      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Posted Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              {editingJobId === job.id ? (
                <>
                  <td><input type="text" name="title" value={editData.title} onChange={handleChange} /></td>
                  <td><input type="text" name="company" value={editData.company} onChange={handleChange} /></td>
                  <td><input type="text" name="location" value={editData.location} onChange={handleChange} /></td>
                  <td>
                    <input
                      type="date"
                      name="postedDate"
                      value={editData.postedDate || ''}
                      onChange={handleChange}
                    />
                  </td>
                  <td><input type="text" name="status" value={editData.status} onChange={handleChange} /></td>
                  <td>
                    <button className="btn btn-success btn-sm me-2" onClick={handleSaveEdit}>Save</button>
                    <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{job.title}</td>
                  <td>{job.company}</td>
                  <td>{job.location}</td>
                  <td>{new Date(job.postedDate).toLocaleDateString()}</td>
                  <td>{job.status}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(job)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobManagement;
