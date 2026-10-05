import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [founder, setFounder] = useState(null);
  const [loading, setLoading] = useState(true);
  const sessionRequest = useRef(null);
  const sessionRevision = useRef(0);

  // On app load, check session via httpOnly cookie
  useEffect(() => {
    let active = true;
    const revision = sessionRevision.current;
    // StrictMode remounts effects in development; share the in-flight session read.
    sessionRequest.current ||= api.get("/auth/me");
    sessionRequest.current
      .then((res) => { if (active && sessionRevision.current === revision) setFounder(res.data.founder); })
      .catch(() => {
        if (active && sessionRevision.current === revision) setFounder(null);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const updateFounder = useCallback((patch) => {
    setFounder((prev) => (prev ? { ...prev, ...patch } : patch));
  }, []);

  const loginWithGoogle = useCallback((founderData) => {
    sessionRevision.current += 1;
    setFounder(founderData);
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    sessionRevision.current += 1;
    const res = await api.post("/auth/login", { email, password });
    setFounder(res.data.founder);
    setLoading(false);
    return res.data.founder;
  }, []);

  const register = useCallback(async (email, password) => {
    sessionRevision.current += 1;
    const res = await api.post("/auth/register", { email, password });
    setFounder(res.data.founder);
    setLoading(false);
    return res.data.founder;
  }, []);

  const logout = useCallback(async () => {
    sessionRevision.current += 1;
    try {
      await api.post("/auth/logout");
    } catch {
      // continue clearing client state even if network fails
    }
    localStorage.removeItem("token");
    localStorage.removeItem("lq_user_signup_launchqueue");
    localStorage.removeItem("lq_active_ref_code");
    sessionStorage.removeItem("lq_active_ref_code");
    setFounder(null);
    setLoading(false);
  }, []);

  const value = useMemo(() => ({ founder, loading, login, register, loginWithGoogle, logout, updateFounder }),
    [founder, loading, login, register, loginWithGoogle, logout, updateFounder]);

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}
