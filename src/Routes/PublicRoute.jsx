import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const PublicRoute = ({ children }) => {
    const { authState } = useAuth();

    if (authState.token) {
        return <Navigate to="/admin-dashboard" />;
    }

    return children;
};

export default PublicRoute;
