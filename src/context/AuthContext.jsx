import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [founder, setFounder] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check session via httpOnly cookie
  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setFounder(res.data.founder))
      .catch(() => {
        setFounder(null);
      })
      .finally(() => setLoading(false));
  }, []);

  function updateFounder(patch) {
    setFounder((prev) => (prev ? { ...prev, ...patch } : patch));
  }

  function loginWithGoogle(founderData) {
    setFounder(founderData);
  }

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    setFounder(res.data.founder);
    return res.data.founder;
  }

  async function register(email, password) {
    const res = await api.post("/auth/register", { email, password });
    setFounder(res.data.founder);
    return res.data.founder;
  }

  async function logout() {
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
  }

  return (
    <AuthContext.Provider
      value={{
        founder,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        updateFounder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}