import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext({
    authState: { email: "", token: "", user_id: "", role: "" },
    login: async (email, password) => {},
    logout: async () => {}
});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(() => {
        const currentTime = new Date().getTime();
        const storedTime = localStorage.getItem("loginTime");
        const isExpired = storedTime && (currentTime - parseInt(storedTime, 10) > 86400000); 

        if (isExpired) {
            localStorage.removeItem("email");
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");
            localStorage.removeItem("loginTime");
            localStorage.removeItem("role");
            return { email: "", token: "", user_id: "", role: "" };
        } else {
            return {
                email: localStorage.getItem("email") || "",
                token: localStorage.getItem("token") || "",
                user_id: localStorage.getItem("user_id") || "",
                role: localStorage.getItem("role") || "",
            };
        }
    });

    useEffect(() => {
        if (authState.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${authState.token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [authState.token]);

    const login = async (email, password) => {
        try {
            const response = await axios.post("https://wd79p.com/backend/public/api/login", { email, password });

            if (response.status === 200 && response.data.token) {
                const { token, user_id } = response.data;

                const userDetails = await axios.get(`https://wd79p.com/backend/public/api/users/${user_id}`);
                const { role } = userDetails.data;

                const userData = { email, token, user_id, role };
                setAuthState(userData);
                localStorage.setItem("email", email);
                localStorage.setItem("token", token);
                localStorage.setItem("user_id", user_id);
                localStorage.setItem("role", role);
                localStorage.setItem("loginTime", new Date().getTime().toString());
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                return { success: true };
            } else {
                return { success: false, message: "Invalid email or password." };
            }
        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, message: "Login failed. Please try again." };
        }
    };

    const logout = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error('No token found');
            return { success: false, message: "No token found." };
        }

        try {
            const response = await axios.post(
                "https://wd79p.com/backend/public/api/logout",
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                setAuthState({ email: "", token: "", user_id: "", role: "" });
                localStorage.removeItem("email");
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
                localStorage.removeItem("role");
                localStorage.removeItem("loginTime");
                delete axios.defaults.headers.common['Authorization'];
                return { success: true };
            } else {
                console.error("Logout failed");
                return { success: false, message: "Logout failed. Please try again." };
            }
        } catch (error) {
            console.error("Logout failed:", error);
            return { success: false, message: "Logout failed. Please try again." };
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

export default AuthContext;
