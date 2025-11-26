import axios from "axios";

const API_URL = "http://localhost:8080/api/ventas";

// 🔐 Headers con token dinámico
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// 📌 Obtener ventas activas
export const getActiveVentas = async () => {
  return await axios.get(API_URL, { headers: getAuthHeaders() });
};

// 📌 Obtener ventas inactivas
export const getInactiveVentas = async () => {
  return await axios.get(`${API_URL}/inactivos`, { headers: getAuthHeaders() });
};

// 📌 Obtener venta por ID (para ver detalle)
export const getVentaById = async (id) => {
  return await axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

// 📌 Registrar nueva venta (con items)
export const registrarVenta = async (ventaData) => {
  try {
    const res = await axios.post(API_URL, ventaData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

// 📌 Activar / Desactivar venta
export const activateVenta = (id) =>
  axios.put(`${API_URL}/activar/${id}`, {}, { headers: getAuthHeaders() });

export const deactivateVenta = (id) =>
  axios.delete(`${API_URL}/desactivar/${id}`, { headers: getAuthHeaders() });

// 📌 Error handler (lo mismo que usas en producto)
function formatAxiosError(error) {
  if (error.response) {
    const data = error.response.data;

    const backendMessage =
      data?.message ||
      Object.values(data)?.[0] ||
      JSON.stringify(data) ||
      "Error desconocido";

    const err = new Error(backendMessage);
    err.status = error.response.status;
    err.raw = data;
    return err;
  }
  return new Error("No se pudo conectar al servidor");
}
