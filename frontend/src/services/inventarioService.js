import axios from "axios";

const API_URL = "http://localhost:8080/api/inventario";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// 📦 Obtener stock de un producto
export const getStockByProducto = async (idProducto) => {
  return await axios.get(`${API_URL}/stock/${idProducto}`, {
    headers: getAuthHeaders(),
  });
};

// 📜 Historial con paginación y filtros
export const getMovimientos = async (params) => {
  return await axios.get(`${API_URL}/movimientos`, {
    params,
    headers: getAuthHeaders(),
  });
};

// ➕ Entrada de inventario
export const registrarEntrada = async (data) => {
  return await axios.post(`${API_URL}/entrada`, data, {
    headers: getAuthHeaders(),
  });
};

// ➖ Salida manual (daños, ajustes, etc.)
export const registrarSalida = async (data) => {
  return await axios.post(`${API_URL}/salida`, data, {
    headers: getAuthHeaders(),
  });
};