import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { authState } = useAuth();

    if (!authState.token) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(authState.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;
