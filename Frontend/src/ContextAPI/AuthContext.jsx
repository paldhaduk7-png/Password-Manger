import React, { createContext, useState } from "react";

// 1. Create the context
export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  // 2. Initial state loaded safely from localStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("Error reading user from localStorage:", e);
      return null;
    }
  });

  // 3. updateUser function that updates both React state and localStorage
  const updateUser = (updatedData) => {
    setUser(updatedData);
    if (updatedData) {
      localStorage.setItem("user", JSON.stringify(updatedData));
    } else {
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
