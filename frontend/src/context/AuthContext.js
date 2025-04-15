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
      localStorage.removeItem("authUser"); // Clear invalid data
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    const API_URL = process.env.REACT_APP_API_URL;
    console.log("AuthContext attempting fetch login for:", username, "Password provided:", !!password); // <-- Thêm log này (Không log password thật)
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
      localStorage.setItem("authUser", JSON.stringify(data.user)); // Store user info
      setIsLoading(false);
      return true; // Indicate success
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed. Please try again.");
      setIsLoading(false);
     
      return false; 
    }
  }; 
  
  
  // Function to handle logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    // Optionally: Redirect to login page or home page using react-router
    // navigate('/login'); // Assuming you have access to navigate function
    console.log("User logged out");
  }; // Check local storage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user on initial load:", e);
        logout(); // Clear inconsistent state
      }
    } else {
      // If one is missing, ensure both are cleared
      logout();
    }
    // You might want to add a check here to verify the token with the backend (`/api/auth/me`)
    // especially if tokens have a short expiry.
  }, []); // Empty dependency array ensures this runs only once on mount

  const value = {
    token,
    user,
    isAuthenticated: !!token, // Simple check if token exists
    isLoading,
    error,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
