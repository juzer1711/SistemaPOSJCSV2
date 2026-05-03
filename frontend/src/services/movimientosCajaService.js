import axios from "axios";

const API_URL = "http://localhost:8080/api/movimientos-caja";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const registrarMovimientoCaja = async (data) => {
  const res = await axios.post(API_URL, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const getMovimientosPorCaja = async (idCaja) => {
  const res = await axios.get(`${API_URL}/caja/${idCaja}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};