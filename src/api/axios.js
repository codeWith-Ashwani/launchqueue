import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Read requests do not need the CSRF header; avoiding it removes an extra CORS round trip.
api.interceptors.request.use((config) => {
  if (!["get", "head", "options"].includes((config.method || "get").toLowerCase())) {
    config.headers.set("X-LaunchQueue-Request", "1");
  }
  return config;
});

export default api;
