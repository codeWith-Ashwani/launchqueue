import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [founder, setFounder] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if there's a saved token and validate it
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => setFounder(res.data.founder))
      .catch(() => {
        localStorage.removeItem("token");
        setFounder(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setFounder(res.data.founder);
    return res.data.founder;
  }

  async function register(email, password) {
    const res = await api.post("/auth/register", { email, password });
    localStorage.setItem("token", res.data.token);
    setFounder(res.data.founder);
    return res.data.founder;
  }

  function logout() {
    localStorage.removeItem("token");
    setFounder(null);
  }

  return (
    <AuthContext.Provider value={{ founder, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}