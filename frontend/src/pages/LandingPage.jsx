import { Box, Button, Card, CardContent, Typography, Fade, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { styles } from "../styles/landing/stylesLanding";
import { useEmpresa } from "../context/EmpresaContext";

export default function LandingPage() {

  const navigate = useNavigate();
  const { empresa } = useEmpresa();

  return (
    <Box sx={styles.root}>

      {/* Panel Izquierdo */}
      <Box sx={styles.branding}>
        <Box sx={styles.brandingContent}>
          <img src={logo} alt="POS System" style={{ width: 220, marginBottom: 30 }} />
          <Typography variant="h4" sx={{ color: "white", fontWeight: "bold", mb: 2, textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
            POS System
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", maxWidth: 350 }}>
            Plataforma para la gestión de ventas, inventario,
            usuarios y control de caja para pequeñas y medianas empresas.
          </Typography>
        </Box>
      </Box>

      {/* Panel Derecho */}
      <Box sx={styles.contentBox}>
        <Fade in timeout={600}>
          <Card sx={styles.card}>
            <CardContent>

              <Typography variant="h4" align="center" gutterBottom>
                Bienvenido
              </Typography>

              <Typography variant="body1" align="center" sx={{ mb: 4 }}>
                Gestiona tu negocio desde una única plataforma.
              </Typography>

              <Stack spacing={2} sx={{ mb: 4 }}>
                <Typography>✓ Registro de ventas</Typography>
                <Typography>✓ Control de inventario</Typography>
                <Typography>✓ Apertura y cierre de caja</Typography>
                <Typography>✓ Gestión de usuarios</Typography>
                <Typography>✓ Reportes y trazabilidad</Typography>
              </Stack>

              {/* Solo aparece si NO hay empresa registrada */}
              {!empresa && (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mb: 2 }}
                  onClick={() => navigate("/registro-empresa")}
                >
                  Comenzar configuración
                </Button>
              )}

              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={() => navigate("/login")}
              >
                Iniciar sesión
              </Button>

            </CardContent>
          </Card>
        </Fade>
      </Box>

    </Box>
  );
}