// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { LoginResponse } from "../api/authApi";
import { login as loginApi } from "../api/authApi";

type AuthContextType = {
  token: string | null;
  user: LoginResponse["user"] | null;
  roles: string[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("authToken"));
  const [user, setUser] = useState<LoginResponse["user"] | null>(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null
  );
  const [roles, setRoles] = useState<string[]>(
    localStorage.getItem("roles") ? JSON.parse(localStorage.getItem("roles") as string) : []
  );

  const isAuthenticated = Boolean(token);

  async function login(email: string, password: string) {
    const resp = await loginApi({ email, password });
    setToken(resp.token);
    setUser(resp.user);
    setRoles(resp.roles);
    localStorage.setItem("authToken", resp.token);
    localStorage.setItem("user", JSON.stringify(resp.user));
    localStorage.setItem("roles", JSON.stringify(resp.roles));
  }

  function logout() {
    setToken(null);
    setUser(null);
    setRoles([]);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("roles");
    window.location.href = "/login";
  }

  useEffect(() => {
    function handleStorage() {
      setToken(localStorage.getItem("authToken"));
      setUser(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null);
      setRoles(localStorage.getItem("roles") ? JSON.parse(localStorage.getItem("roles") as string) : []);
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, roles, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
