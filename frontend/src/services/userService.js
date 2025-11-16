import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

// Obtener headers dinámicamente
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// GET Active Users
export const getActiveUsers = async () => {
  return await axios.get(`${API_URL}`, {
    headers: getAuthHeaders()
  });
};

// GET Inactive Users
export const getInactiveUsers = async () => {
  return await axios.get(`${API_URL}/inactivos`, {
    headers: getAuthHeaders()
  });
};

// Desactivar usuario (borrado lógico)
export const deactivateUser = async (id) => {
  return await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeaders()
  });
};

// Activar usuario
export const activateUser = async (id) => {
  return await axios.put(`${API_URL}/${id}/activar`, {}, {
    headers: getAuthHeaders()
  });
};


// GET BY ID
export const getUserById = async (id) => {
  return await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeaders()
  });
};

// CREATE
export const createUser = async (userData) => {
  try {
    const res = await axios.post(API_URL, userData, {
      headers: getAuthHeaders()
    });
    return res.data;

  } catch (error) {
    throw formatAxiosError(error);
  }
};

// UPDATE
export const updateUser = async (id, userData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, userData, {
      headers: getAuthHeaders()
    });
    return res.data;

  } catch (error) {
    throw formatAxiosError(error);
  }
};

// Manejo de errores
function formatAxiosError(error) {
  if (error.response) {
    const { status, data } = error.response;

    if (status === 400) return { type: "validation", errors: data };
    if (status === 409) return { type: "duplicate", errors: data };

    return { type: "server", message: data?.message || "Error del servidor" };
  }

  return { type: "network", message: "No se pudo conectar al servidor" };
}
