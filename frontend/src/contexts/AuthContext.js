import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("authUser");
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Error parsing stored user data:", e);
      localStorage.removeItem("authUser");
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    const API_URL = process.env.REACT_APP_API_URL;
    console.log(
      "AuthContext attempting fetch login for:",
      username,
      "Password provided:",
      !!password
    );
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed. Please try again.");
      setIsLoading(false);

      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    console.log("User logged out");
  };
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user on initial load:", e);
        logout();
      }
    } else {
      logout();
    }
  }, []);

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    isLoading,
    error,
    setUser,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
