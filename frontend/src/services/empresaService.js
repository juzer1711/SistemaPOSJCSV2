import axios from "axios";

const API_URL = "http://localhost:8080/api/empresa";

// Obtener headers dinámicamente
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Obtener empresa
export const getEmpresa = async () => {
  try {
    const res = await axios.get(API_URL); // sin headers de auth
    return res.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

// Crear empresa
export const createEmpresa = async (empresaData) => {
  try {
    const res = await axios.post(API_URL, empresaData, {
      headers: getAuthHeaders(),
    });

    return res.data;

  } catch (error) {
    throw formatAxiosError(error);
  }
};

// Actualizar empresa
export const updateEmpresa = async (id, empresaData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, empresaData, {
      headers: getAuthHeaders(),
    });

    return res.data;

  } catch (error) {
    throw formatAxiosError(error);
  }
};

// Verificar si existe empresa
export const existsEmpresa = async () => {
  try {

    const empresa = await getEmpresa();

    return !!empresa;

  } catch (error) {

    if (error.status === 404) {
      return false;
    }

    throw error;
  }
};

// Subir logo
export const uploadLogo = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(`${API_URL}/logo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
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

// Exportación agrupada
const empresaService = {
  getEmpresa,
  createEmpresa,
  updateEmpresa,
  existsEmpresa,
  uploadLogo,
};

export default empresaService;