import axios from "axios";

// Configuración base de Axios
// Aquí definimos la URL base de la API backend y el tipo de contenido.
const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },// Indicamos que los datos se enviarán como JSON
});

// Función para login
export const IniciarSesion = async (username, password) => {
  try {
     // Se hace una solicitud POST al endpoint /auth/login con los datos del usuario
    const response = await API.post("/auth/login", { username, password });
    
    // Si la respuesta es exitosa, guardamos el token en el almacenamiento local
    if (response.data.status === "ok") {
      localStorage.setItem("token", response.data.token); // 🔑 Guardar token
    }
     // Retornamos la respuesta del servidor (normalmente contiene status, rol y mensaje)
    return response.data;

    // Si el servidor responde con un error (por ejemplo, 401 o 500)
  } catch (error) {
    if (error.response) {
      return { status: "error", message: error.response.data.message || "Error al iniciar sesión" };
    } else {
      // 🚫 Si no hay respuesta (por ejemplo, el servidor no está levantado)
      return { status: "error", message: "No se pudo conectar con el servidor" };
    }
  }
};

