import axios from "axios";

// In dev: Vite proxy routes /api → localhost:5000 (see vite.config.js)
// In prod: VITE_API_URL must be set in Vercel env vars → your backend URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
