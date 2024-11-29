import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // Store token in localStorage for persistence
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) setToken(storedToken);
  }, []);

  const login = (token) => {
    console.log(token);

    setToken(token);
    localStorage.setItem("authToken", token); // Save to localStorage
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ token, setToken: login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
