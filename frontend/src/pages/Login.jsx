// src/modules/login/Login.jsx
import {
  TextField, Button, Card, CardContent,
  Typography, IconButton, InputAdornment, Box
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Visibility, VisibilityOff, Person, Lock
} from "@mui/icons-material";
import logo from "../assets/logo.png";
import { useState } from "react";
import { useLogin } from "../hooks/login/useLogin";
import { styles } from "../styles/login/stylesLogin";

export default function Login() {
  const theme = useTheme();
  const {
    username,
    password,
    mensaje,
    setUsername,
    setPassword,
    handleSubmit,
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box sx={styles.root(theme)}>
      <Box sx={styles.branding(theme)}>
        <img src={logo} alt="POS System" style={{ width: 200, marginBottom: 30 }} />
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
          POS System
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, textAlign: "center", maxWidth: 320 }}>
          Sistema de ventas y control para papelerías modernas
        </Typography>
      </Box>

      <Box sx={styles.loginBox}>
        <Card sx={styles.card}>
          <CardContent>
            <Typography variant="h5" align="center" sx={{ mb: 3 }}>
              Iniciar Sesión
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Usuario"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, py: 1.4, fontSize: 16 }}>
                Entrar al sistema
              </Button>
            </form>

            {mensaje && (
              <Typography align="center" color="error" sx={{ mt: 2 }}>
                {mensaje}
              </Typography>
            )}
          </CardContent>
        </Card>

        <Typography variant="body2" align="center" sx={{ mt: 4, color: "#777" }}>
          © 2026 POS System — Desarrollado por:
          Juan Serna | Simon Sepulveda | Cristian Ospina
        </Typography>
      </Box>
    </Box>
  );
}