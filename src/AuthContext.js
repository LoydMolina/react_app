import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("credentials")
  );

  const login = (credentials) => {
    localStorage.setItem("credentials", JSON.stringify(credentials));
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("credentials");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
