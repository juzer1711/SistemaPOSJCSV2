import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  InputAdornment,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import logo from "../../assets/logo.png";

import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
} from "@mui/icons-material";

function LoginForm({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  mensaje,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: "white",
          p: 6,
        }}
      >
        <img src={logo} alt="POS System" style={{ width: 200, marginBottom: 30 }} />
        
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
          POS System
        </Typography>

        <Typography variant="body1" sx={{ opacity: 0.9, textAlign: "center", maxWidth: 320 }}>
          Sistema de ventas y control para papelerías modernas
        </Typography>
      </Box>

      {/* Login */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Card
          sx={{
            width: 420,
            borderRadius: 4,
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
            p: 3,
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              align="center"
              sx={{ mb: 3 }}
            >
              Iniciar Sesión
            </Typography>

            <form onSubmit={onSubmit}>
              <TextField
                label="Usuario"
                fullWidth
                margin="normal"
                value={username}
                onChange={onUsernameChange}
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
                onChange={onPasswordChange}
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

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.4,
                  fontSize: 16,
                }}
              >
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

        {/* Footer */}
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 4, color: "#777" }}
        >
          © 2026 POS System — Desarrollado por: 
          Juan Serna | Simon Sepulveda | Cristian Ospina
        </Typography>
      </Box>
    </Box>
  );
}

export default LoginForm;