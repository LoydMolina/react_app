import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create the AuthContext
const AuthContext = createContext({
    authState: { email: "", token: "", user_id: "", role: "" },
    login: async (email, password) => {},
    logout: async () => {}
});

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate(); 
    
    // Initialize authState
    const [authState, setAuthState] = useState(() => {
        const currentTime = new Date().getTime();
        const storedTime = localStorage.getItem("loginTime");
        const isExpired = storedTime && (currentTime - parseInt(storedTime, 10) > 86400000); // Check if token expired

        if (isExpired) {
            // Clear expired tokens
            localStorage.removeItem("email");
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");
            localStorage.removeItem("loginTime");
            localStorage.removeItem("role");
            return { email: "", token: "", user_id: "", role: "" };
        } else {
            // Return stored values
            return {
                email: localStorage.getItem("email") || "",
                token: localStorage.getItem("token") || "",
                user_id: localStorage.getItem("user_id") || "",
                role: localStorage.getItem("role") || "",
            };
        }
    });

    // Set axios default headers based on authState
    useEffect(() => {
        if (authState.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${authState.token}`;
        } else {
            // Clear headers and redirect to login if not authenticated
            delete axios.defaults.headers.common['Authorization'];
            if (window.location.pathname !== "/login") {
                navigate("/login");
            }
        }
    }, [authState.token, navigate]); 

    // Login function
    const login = async (email, password) => {
        try {
            const response = await axios.post("https://wd79p.com/backend/public/api/login", 
                { email, password }
            );

            if (response.status === 200 && response.data.token) {
                const { token, user_id } = response.data;

                // Set authorization header
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                // Fetch user details
                const userDetailsResponse = await axios.get(`https://wd79p.com/backend/public/api/users/${user_id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const { role } = userDetailsResponse.data;

                // Update authState and localStorage
                const userData = { email, token, user_id, role };
                setAuthState(userData);

                localStorage.setItem("email", email);
                localStorage.setItem("token", token);
                localStorage.setItem("user_id", user_id);
                localStorage.setItem("role", role);
                localStorage.setItem("loginTime", new Date().getTime().toString());

                return { success: true, role };
            } else {
                return { success: false, message: "Invalid email or password." };
            }
        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, message: "Login failed. Please try again." };
        }
    };

    // Logout function
    const logout = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error('No token found');
            navigate("/login");
            return { success: false, message: "No token found." };
        }

        // Check if the user is clocked in
        const isClockedIn = localStorage.getItem("isClockedIn");

        try {
            // Only clock out if the user is clocked in
            if (isClockedIn === "true") {
                const clockOutResponse = await axios.post(
                    "https://wd79p.com/backend/public/api/clock-out",
                    {
                        user_id: authState.user_id,
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (clockOutResponse.status !== 200) {
                    console.error("Clock-out failed:", clockOutResponse);
                    return { success: false, message: "Failed to clock out. Please try again." };
                }
            }

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
                // Clear auth state and localStorage
                setAuthState({ email: "", token: "", user_id: "", role: "" });
                localStorage.removeItem("email");
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
                localStorage.removeItem("role");
                localStorage.removeItem("loginTime");
                localStorage.removeItem("isClockedIn");
                localStorage.removeItem("clockedInTime");
                delete axios.defaults.headers.common['Authorization'];

                navigate("/login");

                return { success: true };
            } else {
                console.error("Logout failed");
                return { success: false, message: "Logout failed. Please try again." };
            }
        } catch (error) {
            console.error("Logout/Clock-out failed:", error);
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
