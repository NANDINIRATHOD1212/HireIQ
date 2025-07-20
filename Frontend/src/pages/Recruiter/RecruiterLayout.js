import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../NavBar';
const RecruiterLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <NavBar />
      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default RecruiterLayout;
