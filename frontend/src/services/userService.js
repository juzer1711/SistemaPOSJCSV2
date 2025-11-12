import axios from "axios";

const API_URL = "http://localhost:8080/api/users"; 

// 🔹 Obtener todos los usuarios
export const getUsers = async () => {
  return await axios.get(API_URL);
};

// 🔹 Obtener usuario por ID
export const getUserById = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
};

// 🔹 Crear nuevo usuario
export const createUser = async (userData) => {
  try {
    const res = await axios.post(API_URL, userData);
    return res.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // 🔹 Error de validación (400)
      if (status === 400 && typeof data === "object") {
        throw { type: "validation", errors: data };
      }

      // 🔹 Error de duplicado (409)
      if (status === 409 && typeof data === "object") {
        throw { type: "duplicate", errors: data };
      }

      // 🔹 Otro error del servidor
      throw { type: "server", message: data?.message || "Error en el servidor" };
    }

    // 🔹 Error de red
    throw { type: "network", message: "No se pudo conectar con el servidor" };
  }
};

// 🔹 Actualizar usuario existente
export const updateUser = async (id, userData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, userData);
    return res.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      // 🔹 Validaciones (400)
      if (status === 400 && typeof data === "object") {
        throw { type: "validation", errors: data };
      }

      // 🔹 Duplicados (409)
      if (status === 409 && typeof data === "object") {
        throw { type: "duplicate", errors: data };
      }

      throw { type: "server", message: data?.message || "Error en el servidor" };
    }

    throw { type: "network", message: "Error de conexión con el servidor" };
  }
};
// 🔹 Eliminar usuario por ID
export const deleteUser = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};
