import axios from "axios";

const API_URL = "http://localhost:8080/api/clientes";

// Obtener headers dinámicamente
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Obtener todos los clientes activos
export const getActiveClients = async () => {
  return await axios.get(`${API_URL}`, {
    headers: getAuthHeaders(),
  });
};

// Obtener todos los clientes inactivos
export const getInactiveClients = async () => {
  return await axios.get(`${API_URL}/inactivos`, {
    headers: getAuthHeaders(),
  });
};

// Obtener cliente por ID
export const getClientById = async (id) => {
  return await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
};

// Desactivar cliente (borrado lógico)
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



// Crear cliente
export const createClient = async (clientData) => {
  try {
    const res = await axios.post(API_URL, clientData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

// Actualizar cliente
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

