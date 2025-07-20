import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from "../../api.js";
function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/auth/logout`, { withCredentials: true });
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Logout failed');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="d-block text-white mb-2"
      style={{
        background: 'none',
        border: 'none',
        padding: '5px 20px',
        font: 'inherit',
        cursor: 'pointer',
        textAlign: 'left',
        
      }}
    >
      🚪 Logout
    </button>
  );
}

export default Logout;
