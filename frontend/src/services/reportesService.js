import axios from "axios";

const API_URL = "http://localhost:8080/api/reportes";

// 🔐 Headers con token dinámico
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// 📊 Resumen general
export const getReporteResumen = () => {
  return axios.get(`${API_URL}/resumen`, {
    headers: getAuthHeaders(),
  });
};

// 💳 Ventas por método de pago
export const getVentasPorMetodoPago = () => {
  return axios.get(`${API_URL}/metodos-pago`, {
    headers: getAuthHeaders(),
  });
};

// 🏆 Top productos vendidos
export const getTopProductos = () => {
  return axios.get(`${API_URL}/top-productos`, {
    headers: getAuthHeaders(),
  });
};

// 🧑‍💼 Ventas por cajero
export const getVentasPorCajero = () => {
  return axios.get(`${API_URL}/ventas-cajero`, {
    headers: getAuthHeaders(),
  });
};

// 📦 Stock (critico / bajo / normal)
export const getStock = (tipo) => {
  return axios.get(`${API_URL}/stock`, {
    params: { tipo }, // critico | bajo | normal
    headers: getAuthHeaders(),
  });
};