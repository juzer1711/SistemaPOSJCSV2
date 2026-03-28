import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

// Obtener headers dinámicamente
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// GET Active Users
export const getActiveUsers = async (page, size) => {
  return await axios.get(`${API_URL}`, {
    params: {
      page: page,
      size: size,
      sort: "primerApellido,asc"
    },
    headers: getAuthHeaders()
  });
};

// GET Inactive Users
export const getInactiveUsers = async (page, size) => {
  return await axios.get(`${API_URL}/inactivos`, {
    params: {
      page: page,
      size: size,
      sort: "primerApellido,asc"
    },
    headers: getAuthHeaders()
  });
};

// Desactivar usuario (borrado lógico)
export const deactivateUser = async (id) => {
  return await axios.patch(`${API_URL}/desactivar/${id}`, {
    headers: getAuthHeaders()
  });
};

// Activar usuario
export const activateUser = async (id) => {
  return await axios.patch(`${API_URL}/activar/${id}`, {}, {
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

export const searchUsers = (params) => {
  return axios.get(`${API_URL}/search`, {
    params,
    headers: getAuthHeaders()
  });
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
