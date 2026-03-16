import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/Login/LoginFormat";
import { IniciarSesion} from "../services/authservice";

function LoginContainer() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setMensaje("");

  try {
    const res = await IniciarSesion(username, password);

    // Esto solo se ejecuta si status HTTP = 200
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
    // Axios entra aquí cuando el servidor devuelve 4xx o 5xx
    if (err.response) {
      const { data } = err.response;
      setMensaje(data.message || "Credenciales inválidas");
    } else {
      setMensaje("Error de conexión con el servidor");
    }
  }
};

  return (
    <LoginForm
      username={username}
      password={password}
      onUsernameChange={(e) => setUsername(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onSubmit={handleSubmit}
      mensaje={mensaje}
    />
  );
}

export default LoginContainer;
