import axios from "axios";

const API_URL = "http://localhost:8080/api/productos";

//  Obtener todos los productos
export const getProducts = async () => {
  return await axios.get(API_URL);
};

//  Obtener producto por ID
export const getProductoById = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
};

//  Crear producto
export const createProduct = async (data) => {
  try {
    const res = await axios.post(API_URL, data);
    return res.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      //  Errores de validación
      if (status === 400 && typeof data === "object") {
        throw { type: "validation", errors: data };
      }

      //  Errores por duplicados
      if (status === 409 && typeof data === "object") {
        throw { type: "duplicate", errors: data };
      }

      //  Otros errores
      throw { type: "server", message: data?.message || "Error en el servidor" };
    }

    throw { type: "network", message: "No se pudo conectar con el servidor" };
  }
};

//  Actualizar producto
export const updateProduct = async (id, data) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400 && typeof data === "object") {
        throw { type: "validation", errors: data };
      }

      if (status === 409 && typeof data === "object") {
        throw { type: "duplicate", errors: data };
      }

      throw { type: "server", message: data?.message || "Error en el servidor" };
    }

    throw { type: "network", message: "Error de conexión" };
  }
};

//  Desactivar producto
export const desactivarProducto = async (id) => {
  return await axios.put(`${API_URL}/desactivar/${id}`);
};

//  Activar producto
export const activarProducto = async (id) => {
  return await axios.put(`${API_URL}/activar/${id}`);
};
