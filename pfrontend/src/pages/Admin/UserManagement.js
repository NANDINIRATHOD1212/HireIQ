import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/AdminDashboard.css';
import '../../css/Usermanagement.css'

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/admin/users');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:3000/admin/users/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const startEditing = (user) => {
    setEditingUserId(user.id);
    setEditFormData({ name: user.name, email: user.email, role: user.role });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditFormData({ name: '', email: '', role: '' });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const saveEdit = async (userId) => {
    try {
      await axios.put(`http://localhost:3000/admin/users/${userId}`, editFormData);
      // Update local users state
      setUsers(users.map(u => (u.id === userId ? { ...u, ...editFormData } : u)));
      cancelEditing();
    } catch (err) {
      alert('Failed to update user');
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="user-management-container container py-4">
    <div className="container py-4">
      <h2>User Management</h2>
      <table className="table table-striped table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                {editingUserId === user.id ? (
                  <input 
                    type="text" 
                    name="name" 
                    value={editFormData.name} 
                    onChange={handleEditChange} 
                    className="form-control" 
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <input 
                    type="email" 
                    name="email" 
                    value={editFormData.email} 
                    onChange={handleEditChange} 
                    className="form-control" 
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <select 
                    name="role" 
                    value={editFormData.role} 
                    onChange={handleEditChange} 
                    className="form-select"
                  >
                    <option value="admin">Admin</option>
                    <option value="recruiter">Recruiter</option>
                    <option value="candidate">Candidate</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <>
                    <button className="btn btn-success btn-sm me-2" onClick={() => saveEdit(user.id)}>Save</button>
                    <button className="btn btn-secondary btn-sm" onClick={cancelEditing}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => startEditing(user)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default UserManagement;
