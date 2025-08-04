"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // โหลด user จาก localStorage เมื่อ component mount
  useEffect(() => {
    const stored = localStorage.getItem("auth-user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // ฟังก์ชัน login/signup (mock)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("auth-user", JSON.stringify(userData));
  };

  const signup = (userData) => {
    setUser(userData);
    localStorage.setItem("auth-user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth-user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook
export function useAuth() {
  return useContext(AuthContext);
}