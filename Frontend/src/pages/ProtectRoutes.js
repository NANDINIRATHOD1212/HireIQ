
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, role }) => {
  const user = useSelector(state => state.auth.user);

  console.log('ProtectedRoute user:', user);
  console.log('Required role:', role);

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    console.log(`User role (${user.role}) does not match required role (${role}), redirecting to /`);
    return <Navigate to="/" />;
  }

  console.log('Role matches, rendering children');
  return children;
};


export default ProtectedRoute;
