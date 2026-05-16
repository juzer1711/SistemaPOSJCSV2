import axios from "axios";

const API_URL = "http://localhost:8080/api/cajas";

// Obtener headers dinámicamente
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// GET Cajas abiertas
export const getCajasAbiertas = async (page, size) => {
  return await axios.get(`${API_URL}/abiertas`, {
    params: {
      page: page,
      size: size,
      sort: "fechaApertura,desc"
    },
    headers: getAuthHeaders()
  });
};

// GET Cajas cerradas
export const getCajasCerradas = async (page, size) => {
  return await axios.get(`${API_URL}/cerradas`, {
    params: {
      page: page,
      size: size,
      sort: "fechaApertura,desc"
    },
    headers: getAuthHeaders()
  });
};


// GET BY ID
export const getCajaById = async (id) => {
  return await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeaders()
  });
};

// GET BY IDUSUARIO
export const getCajaActivaByUsuario = async (idUsuario) => {
  return await axios.get(`${API_URL}/${idUsuario}/activa`,{
    headers: getAuthHeaders()
  });
};

// Abrir Caja
export const abrirCaja = async (cajaData) => {
  try {
    const res = await axios.post(`${API_URL}/abrir`, cajaData, {
      headers: getAuthHeaders()
    });
    return res.data;

  } catch (error) {
    throw formatAxiosError(error);
  }
};

// Cerrar Caja
export const cerrarCaja = async (cajaData) => {
  try {
    const res = await axios.post(`${API_URL}/cerrar`, cajaData, {
      headers: getAuthHeaders()
    });
    return res.data;

  } catch (error) {
    throw formatAxiosError(error);
  }
};

export const searchCajas = (params) => {
  return axios.get(`${API_URL}/search`, {
    params,
    headers: getAuthHeaders()
  });
};

// 🔥 Forzar cierre de caja (solo admin)
export const forzarCierreCaja = async (idCaja) => {
  try {
    const res = await axios.post(
      `${API_URL}/cerrar/admin/${idCaja}`,
      {},
      { headers: getAuthHeaders() }
    );
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