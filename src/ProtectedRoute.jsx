// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
    const { authState } = useAuth();

    if (!authState.token) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
