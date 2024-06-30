// AuthContext.jsx
import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        email: localStorage.getItem("email") || "",
        token: localStorage.getItem("token") || "",
    });

    const login = async (email, password) => {
        try {
            const response = await axios.post("https://wd79p.com/backend/public/api/login", {
                email,
                password,
            });

            if (response.status === 200 && response.data.token) {
                const { token } = response.data;
                const userData = { email, token };
                setAuthState(userData);
                localStorage.setItem("email", email);
                localStorage.setItem("token", token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                return { success: true };
            } else {
                return { success: false, message: "Invalid email or password." };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        try {
            const response = await axios.post("https://wd79p.com/backend/public/api/logout");

            if (response.status === 200) {
                setAuthState({ email: "", token: "" });
                localStorage.removeItem("email");
                localStorage.removeItem("token");
                delete axios.defaults.headers.common['Authorization'];
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const value = {
        authState,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
