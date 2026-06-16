import axios from "axios";

const API_URL = "http://localhost:8080/api/asistente";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const consultarAsistente = async (pregunta) => {
  try {
    const response = await axios.post(
      `${API_URL}/consultar`,
      { pregunta },
      { headers: getAuthHeaders() }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        "No fue posible consultar el asistente.";

      throw new Error(message);
    }

    throw new Error("No se pudo conectar con el asistente.");
  }
};
