import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#e3f2fd",
      }}
    >
      <Card sx={{ width: 350, p: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
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
            />

            {/* Contraseña con botón de visibilidad */}
            <TextField
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={password}
              onChange={onPasswordChange}
              InputProps={{
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

            {/* Botón de ingreso */}
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Entrar
            </Button>
          </form>

          {/* Mensaje de error */}
          {mensaje && (
            <Typography align="center" color="error" sx={{ mt: 2 }}>
              {mensaje}
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;
