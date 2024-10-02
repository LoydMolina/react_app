import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjust the path as needed

const RoleProtectedRoute = ({ roles }) => {
  const { authState } = useAuth(); // Get the logged-in user info from the AuthContext

  if (!authState.token || !roles.includes(authState.role)) {
    // Redirect to login if user is not logged in or doesn't have the required role
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
