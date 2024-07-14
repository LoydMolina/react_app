// RoleBasedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RoleBasedRoute = ({ allowedRoles, children }) => {
    const { authState } = useAuth();

    if (!authState.role) {
        return <p>Loading...</p>; 
    }

    if (!allowedRoles.includes(authState.role)) {
        return <Navigate to="/" />; 
    }

    return children;
};

export default RoleBasedRoute;
