import axios from "axios";

const API_URL = "http://localhost:8080/api/productos";

// Obtener headers dinámicamente
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Obtener todos los productos activos
export const getActiveProducts = async () => {
  return await axios.get(`${API_URL}`, {
    headers: getAuthHeaders(),
  });
};

// Obtener todos los productos inactivos
export const getInactiveProducts = async () => {
  return await axios.get(`${API_URL}/inactivos`, {
    headers: getAuthHeaders(),
  });
};

//  Obtener producto por ID
export const getProductoById = async (id) => {
   return await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
};

// Desactivar producto (borrado lógico)
export const deactivateProduct = async (id) => {
  return await axios.delete(`${API_URL}/desactivar/${id}`, {
    headers: getAuthHeaders(),
  });
};

// Activar producto
export const activateProduct = async (id) => {
  return await axios.put(`${API_URL}/activar/${id}`, {}, {
    headers: getAuthHeaders(),
  });
};

//  Crear producto
export const createProduct = async (productData) => {
  try {
    const res = await axios.post(API_URL, productData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

//  Actualizar producto
export const updateProduct = async (id, productData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, productData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

// Manejo de errores
function formatAxiosError(error) {
  if (error.response) {
    const data = error.response.data;

    // Detecta el mensaje del backend
    const backendMessage =
      data?.message ||
      Object.values(data)?.[0] ||   // si viene { campo: "error" }
      JSON.stringify(data) ||
      "Error desconocido";

    const err = new Error(backendMessage);
    err.status = error.response.status;
    err.raw = data;
    return err;
  }

  return new Error("No se pudo conectar al servidor");
}