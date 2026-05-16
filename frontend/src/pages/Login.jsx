// src/modules/login/Login.jsx
import {
  TextField, Button, Card, CardContent,
  Typography, IconButton, InputAdornment,
  Box, Alert, Fade, CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Visibility, VisibilityOff, Person, Lock } from "@mui/icons-material";
import logo from "../assets/logo.png";
import { useState } from "react";
import { useLogin } from "../hooks/login/useLogin";
import { styles } from "../styles/login/stylesLogin";
import { loginSchema } from "../validation/validationSchema";

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
  const [isLoading, setIsLoading]       = useState(false);
  const [fieldErrors, setFieldErrors]   = useState({});

  // ── Limpia el error del campo al escribir ──────────────────────────
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (fieldErrors.username) setFieldErrors((p) => ({ ...p, username: "" }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: "" }));
  };

  // ── Submit con validación Yup antes de tocar el servidor ──────────
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // abortEarly: false → recoge TODOS los errores a la vez
      await loginSchema.validate({ username, password }, { abortEarly: false });
    } catch (validationError) {
      // Convierte el array de errores de Yup en { campo: "mensaje" }
      const errors = validationError.inner.reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
      setFieldErrors(errors);
      return; // ✅ corta aquí, nunca llega al servidor
    }

    // ── Sin errores de validación → llama al hook ──────────────────
    setFieldErrors({});
    setIsLoading(true);
    await handleSubmit(e);
    setIsLoading(false);
  };

  return (
    <Box sx={styles.root(theme)}>

      {/* ── Panel izquierdo ── */}
      <Box sx={styles.branding(theme)}>
        <Box sx={styles.brandingContent}>
          <img
            src={logo}
            alt="POS System"
            style={{
              width: 200,
              marginBottom: 30,
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
            }}
          />
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
            POS System
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.92, textAlign: "center", maxWidth: 320, textShadow: "0 1px 4px rgba(0,0,0,0.25)" }}>
            Sistema de ventas y control para papelerías modernas
          </Typography>
        </Box>
      </Box>

      {/* ── Panel derecho ── */}
      <Box sx={styles.loginBox}>
        <Fade in timeout={500}>
          <Card sx={styles.card}>
            <CardContent>
              <Typography variant="h5" align="center" sx={{ mb: 3, fontWeight: 600 }}>
                Iniciar Sesión
              </Typography>

              <form onSubmit={handleFormSubmit} noValidate>

                <TextField
                  label="Usuario"
                  fullWidth
                  margin="normal"
                  value={username}
                  onChange={handleUsernameChange}
                  disabled={isLoading}
                  autoComplete="username"
                  error={!!fieldErrors.username}
                  helperText={fieldErrors.username || " "}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color={fieldErrors.username ? "error" : "primary"} />
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
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  autoComplete="current-password"
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password || " "}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color={fieldErrors.password ? "error" : "primary"} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                          edge="end"
                          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading}
                  sx={{ mt: 2, py: 1.4, fontSize: 16, position: "relative" }}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress
                        size={22}
                        thickness={5}
                        sx={{
                          color: "white",
                          position: "absolute",
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      />
                      <span style={{ opacity: 0 }}>Verificando...</span>
                    </>
                  ) : (
                    "Entrar al sistema"
                  )}
                </Button>
              </form>

              {/* ── Error del servidor (viene del hook) ── */}
              <Fade in={!!mensaje} unmountOnExit>
                <Alert severity="error" variant="outlined" sx={{ mt: 2 }}>
                  {mensaje}
                </Alert>
              </Fade>

            </CardContent>
          </Card>
        </Fade>

        <Typography variant="body2" align="center" sx={{ mt: 4, color: "text.secondary" }}>
          © 2026 POS System — Desarrollado por:{" "}
          Juan Serna | Simon Sepulveda | Cristian Ospina
        </Typography>
      </Box>
    </Box>
  );
}