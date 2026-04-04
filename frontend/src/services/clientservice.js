import axios from "axios";

const API_URL = "http://localhost:8080/api/clientes";

// Obtener headers dinámicamente
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// SEARCH 
export const searchClients = (params) => {
  return axios.get(`${API_URL}/search`, {
    params,
    headers: getAuthHeaders(),
  });
};

// GET Active Clients (paginado)
export const getActiveClients = async (params) => {
  return await axios.get(`${API_URL}`, {
    params,
    headers: getAuthHeaders(),
  });
};

// GET Inactive Clients (paginado)
export const getInactiveClients = async (params) => {
  return await axios.get(`${API_URL}/inactivos`, {
    params,
    headers: getAuthHeaders(),
  });
};

// GET BY ID
export const getClientById = async (id) => {
  return await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
};

// Desactivar cliente
export const deactivateClient = async (id) => {
  return await axios.delete(`${API_URL}/desactivar/${id}`, {
    headers: getAuthHeaders(),
  });
};

// Activar cliente
export const activateClient = async (id) => {
  return await axios.put(`${API_URL}/activar/${id}`, {}, {
    headers: getAuthHeaders(),
  });
};

// CREATE
export const createClient = async (clientData) => {
  try {
    const res = await axios.post(API_URL, clientData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// UPDATE
export const updateClient = async (id, clientData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, clientData, {
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

