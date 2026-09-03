import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as authApi from "../api/auth/auth.api";
import { getMyProfile } from "../api/users/users.api";
import { getToken, hasToken, clearToken } from "../utils/token";
import { registerUnauthorizedHandler } from "../config/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); 
  const [actionLoading, setActionLoading] = useState(false);


  useEffect(() => {
    let cancelled = false;
    async function restore() {
      if (!hasToken()) {
        setAuthLoading(false);
        return;
      }
      try {
        const profile = await getMyProfile();
        if (!cancelled) setUser(profile);
      } catch {
        clearToken();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    }
    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(() => setUser(null));
  }, []);

  const login = useCallback(async (values) => {
    setActionLoading(true);
    try {
      const { user: loggedInUser } = await authApi.login(values);
      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const register = useCallback(async (values) => {
    setActionLoading(true);
    try {
      const { user: newUser } = await authApi.register(values);
      setUser(newUser);
      return newUser;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!getToken()) return null;
    const profile = await getMyProfile();
    setUser(profile);
    return profile;
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    authLoading,
    actionLoading,
    login,
    register,
    logout,
    refreshProfile,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
