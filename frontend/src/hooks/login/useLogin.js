import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IniciarSesion } from "../../services/authservice";

export const useLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const res = await IniciarSesion(username, password);

      if (res.status === "ok") {
        localStorage.setItem("role", res.role);
        if (res.role === "ADMINISTRADOR") {
          navigate("/admin-dashboard");
        } else if (res.role === "CAJERO") {
          navigate("/cajero-dashboard");
        }
      } else {
        setMensaje(res.message || "Credenciales inválidas");
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;
        setMensaje(data.message || "Credenciales inválidas");
      } else {
        setMensaje("Error de conexión con el servidor");
      }
    }
  };

  return {
    username,
    password,
    mensaje,
    setUsername,
    setPassword,
    handleSubmit,
  };
};