import React from 'react'
import { createContext, useState } from "react";

// 1. Create the context
export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {

  // 2. Data we want to share
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
