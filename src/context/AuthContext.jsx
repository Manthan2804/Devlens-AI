import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "devlens_user";

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const login = (userData) => {
    const u = userData || { name: "Priya Sharma", email: "priya@devlens.ai" };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch {
      // localStorage unavailable — fall back to in-memory only
    }
    setUser(u);
  };

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}