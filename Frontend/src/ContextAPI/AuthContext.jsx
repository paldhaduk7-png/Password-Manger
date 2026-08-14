import { useState, useEffect } from "react";
import { AuthContext } from "./context";
import axios from "axios";
import { toast } from "sonner";

export { AuthContext };

// Request interceptor to automatically attach JWT Bearer token if present
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const AuthProvider = ({ children }) => {
  // Initial state loaded safely from localStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("Error reading user from localStorage:", e);
      return null;
    }
  });

  // updateUser function that synchronizes React state, user, and token in localStorage
  const updateUser = (updatedData, token) => {
    setUser(updatedData);
    if (updatedData) {
      localStorage.setItem("user", JSON.stringify(updatedData));
      if (token) {
        localStorage.setItem("token", token);
      }
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  // Set up global Axios interceptor for handling 401 Unauthorized / Token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // If we had a stored user session, clear it because token is expired/invalid
          const currentUser = localStorage.getItem("user");
          if (currentUser) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
            const msg = error.response.data?.message || "Session expired. Please log in again.";
            toast.error(msg);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

