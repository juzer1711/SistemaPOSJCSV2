import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// JWT interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ==========================
// AUDITORÍA
// ==========================

export const obtenerAuditoria = async (params) => {
  const response = await API.get("/auditoria", {
    params,
  });

  return response.data;
};