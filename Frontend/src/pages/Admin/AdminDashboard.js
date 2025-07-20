import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import '../../css/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/analytics');
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="admin-dashboard container-fluid py-5">
      <h1 className="text-center mb-4">
        Welcome to <span className="brand-name">Admin Dashboard</span>
      </h1>

      <h4 className="mb-3 text-center text-dark">📊 Platform Analytics</h4>

      <div className="row g-4 mb-5 justify-content-center">
        {[ 
          { label: '👥 Total Users', value: stats.totalRecruiters + stats.totalCandidates },
          { label: '🧑‍💼 Recruiters', value: stats.totalRecruiters },
          { label: '👨‍🎓 Candidates', value: stats.totalCandidates },
          { label: '📄 Job Posts', value: stats.totalJobs },
          { label: '📝 Assessments', value: stats.totalAssessments },
          { label: '📬 Applications', value: stats.totalApplications },
        ].map((stat, index) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={index}>
            <div className="card shadow dashboard-card text-center border-0 rounded-4">
              <div className="card-body">
                <h5 className="card-title text-secondary">{stat.label}</h5>
                <p className="display-6 fw-bold text-gradient">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center flex-wrap gap-3 mt-4">
        <button 
          className="btn btn-outline-primary px-4 py-2 fw-semibold"
          onClick={() => navigate('/admin/users')}
        >
          👥 Manage Users
        </button>

        <button 
          className="btn btn-outline-success px-4 py-2 fw-semibold"
          onClick={() => navigate('/admin/jobs')}
        >
          💼 Manage Jobs
        </button>

        <button
          className="btn btn-outline-secondary px-4 py-2 fw-semibold"
          onClick={() => navigate('/')}
          style={{ backgroundColor: '#888888', color: 'white' }}
        >
          🔙 Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
