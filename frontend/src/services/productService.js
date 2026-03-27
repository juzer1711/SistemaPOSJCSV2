import axios from "axios";

const API_URL = "http://localhost:8080/api/productos";

// Obtener headers dinámicamente
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// SEARCH 
export const searchProducts = (params) => {
  return axios.get(`${API_URL}/search`, {
    params,
    headers: getAuthHeaders()
  });
};

// GET Active Products
export const getActiveProducts = async () => {
  return await axios.get(`${API_URL}`, {
    headers: getAuthHeaders(),
  });
};

// GET Inactive Products
export const getInactiveProducts = async () => {
  return await axios.get(`${API_URL}/inactivos`, {
    headers: getAuthHeaders(),
  });
};

// GET Categorias
export const getCategorias = async () => {
  return await axios.get(`http://localhost:8080/api/categorias`, {
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

// GET BY ID
export const getProductoById = async (id) => {
   return await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
};

// CREATE
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

// CREATE categorias
export const createCategoria = async (categoriaData) => {
  try {
    const res = await axios.post(`http://localhost:8080/api/categorias`, categoriaData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

// UPDATE
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

// UPDATE Categoria
export const updateCategoria = async (id, categoriaData) => {
  try {
    const res = await axios.put(`http://localhost:8080/api/categorias/${id}`, categoriaData, {
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