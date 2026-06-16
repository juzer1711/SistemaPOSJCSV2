import axios from "axios";

const API_URL = "http://localhost:8080/api/export";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const exportVentasExcel = (params) =>
  axios.get(`${API_URL}/ventas/excel`, {
    params,
    headers: getAuthHeaders(),
    responseType: "blob", // ← clave para archivos binarios
  });

export const exportVentasCSV = (params) =>
  axios.get(`${API_URL}/ventas/csv`, {
    params,
    headers: getAuthHeaders(),
    responseType: "blob",
  });

export const exportCajasExcel = (params) =>
  axios.get(`${API_URL}/cajas/excel`, {
    params,
    headers: getAuthHeaders(),
    responseType: "blob",
  });

export const exportCajasCSV = (params) =>
  axios.get(`${API_URL}/cajas/csv`, {
    params,
    headers: getAuthHeaders(),
    responseType: "blob",
  });

// ── CLIENTES ──────────────────────────────────────────────────────
export const exportClientesExcel = (params) =>
  axios.get(`${API_URL}/clientes/excel`, {
    params, headers: getAuthHeaders(), responseType: "blob",
  });

export const exportClientesCSV = (params) =>
  axios.get(`${API_URL}/clientes/csv`, {
    params, headers: getAuthHeaders(), responseType: "blob",
  });

// ── PRODUCTOS ─────────────────────────────────────────────────────
export const exportProductosExcel = (params) =>
  axios.get(`${API_URL}/productos/excel`, {
    params, headers: getAuthHeaders(), responseType: "blob",
  });

export const exportProductosCSV = (params) =>
  axios.get(`${API_URL}/productos/csv`, {
    params, headers: getAuthHeaders(), responseType: "blob",
  });

// ── USUARIOS ──────────────────────────────────────────────────────
export const exportUsuariosExcel = (params) =>
  axios.get(`${API_URL}/usuarios/excel`, {
    params, headers: getAuthHeaders(), responseType: "blob",
  });

export const exportUsuariosCSV = (params) =>
  axios.get(`${API_URL}/usuarios/csv`, {
    params, headers: getAuthHeaders(), responseType: "blob",
  });

// AUDITORIA
export const exportAuditoriaExcel = (params) =>
  axios.get(`${API_URL}/auditoria/excel`, {
    params, headers: getAuthHeaders(), responseType: "blob",
  });

export const exportAuditoriaCSV = (params) =>
  axios.get(`${API_URL}/auditoria/csv`, {
    params, headers: getAuthHeaders(), responseType: "blob",
  });
