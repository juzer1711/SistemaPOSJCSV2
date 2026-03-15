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

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#e3f2fd,#bbdefb)",
      }}
    >
      <Card
        sx={{
          width: 360,
          p: 3,
          borderRadius: 3,
          boxShadow: 6,
        }}
      >
        <CardContent>

          <Typography
            variant="h5"
            align="center"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Inicio de Sesión
          </Typography>

          <form onSubmit={onSubmit}>

            {/* Usuario */}
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

            {/* Contraseña */}
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
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Botón */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.2,
                fontWeight: "bold",
              }}
            >
              Entrar
            </Button>

          </form>

          {/* Mensaje error */}
          {mensaje && (
            <Typography
              align="center"
              color="error"
              sx={{ mt: 2 }}
            >
              {mensaje}
            </Typography>
          )}

        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginForm;