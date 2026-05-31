import {
  Box, Card, CardContent, Typography, TextField,
  Button, Alert, Fade, CircularProgress, Grid,
  Avatar, IconButton, Tooltip,
} from "@mui/material";
import { Business, PhotoCamera, ArrowBack } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { styles } from "../styles/empresa/stylesRegistroEmpresa";
import { useRegistroEmpresa } from "../hooks/empresa/useRegistroEmpresa";

export default function RegistroEmpresa() {

  const theme = useTheme();
  const navigate = useNavigate();

  const {
    empresa,
    logoPreview,
    fileInputRef,
    loading,
    mensaje,
    fieldErrors,
    handleChange,
    handleLogoSelect,
    handleSubmit,
  } = useRegistroEmpresa();

  return (
    <Box sx={styles.root(theme)}>

      {/* Panel izquierdo */}
      <Box sx={styles.branding(theme)}>
        <Box sx={styles.brandingContent}>
          <img src={logo} alt="POS System" style={{ width: 220, marginBottom: 30 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: "white" }}>
            Configuración Inicial
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", maxWidth: 350 }}>
            Registra la información principal de tu empresa
            para comenzar a utilizar el sistema POS.
          </Typography>
        </Box>
      </Box>

      {/* Panel derecho */}
      <Box sx={styles.registerBox}>
        <Fade in timeout={500}>
          <Card sx={styles.card}>
            <CardContent>

              {/* Botón volver */}
              <Box sx={{ mb: 1 }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => navigate("/")}
                  size="small"
                  color="inherit"
                >
                  Volver
                </Button>
              </Box>

              <Typography variant="h5" align="center" sx={{ mb: 3 }}>
                Registro de Empresa
              </Typography>

              {/* Logo opcional */}
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={logoPreview || undefined}
                    sx={{
                      width: 100, height: 100,
                      border: "3px solid",
                      borderColor: "primary.main",
                      bgcolor: "grey.100",
                    }}
                  >
                    <Business sx={{ fontSize: 50, color: "grey.400" }} />
                  </Avatar>

                  <Tooltip title="Agregar logo (opcional)">
                    <IconButton
                      onClick={() => fileInputRef.current.click()}
                      sx={{
                        position: "absolute",
                        bottom: 0, right: 0,
                        bgcolor: "primary.main",
                        color: "white",
                        width: 30, height: 30,
                        "&:hover": { bgcolor: "primary.dark" },
                      }}
                    >
                      <PhotoCamera sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Tooltip>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleLogoSelect}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Logo opcional — máx. 2MB
                </Typography>
              </Box>

              {/* Campos */}
              <Grid container spacing={2}>

                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Nombre Comercial" name="nombreComercial"
                    value={empresa.nombreComercial} onChange={handleChange}
                    error={!!fieldErrors.nombreComercial}
                    helperText={fieldErrors.nombreComercial || " "} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Razón Social" name="razonSocial"
                    value={empresa.razonSocial} onChange={handleChange}
                    error={!!fieldErrors.razonSocial}
                    helperText={fieldErrors.razonSocial || " "} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="NIT" name="nit"
                    value={empresa.nit} onChange={handleChange}
                    error={!!fieldErrors.nit}
                    helperText={fieldErrors.nit || " "} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Teléfono" name="telefono"
                    value={empresa.telefono} onChange={handleChange}
                    error={!!fieldErrors.telefono}
                    helperText={fieldErrors.telefono || " "} />
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth label="Dirección" name="direccion"
                    value={empresa.direccion} onChange={handleChange}
                    error={!!fieldErrors.direccion}
                    helperText={fieldErrors.direccion || " "} />
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth label="Correo" name="correo"
                    value={empresa.correo} onChange={handleChange}
                    error={!!fieldErrors.correo}
                    helperText={fieldErrors.correo || " "} />
                </Grid>

              </Grid>

              <Button
                variant="contained"
                fullWidth
                startIcon={loading ? null : <Business />}
                sx={{ mt: 4, py: 1.5 }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading
                  ? <CircularProgress size={24} color="inherit" />
                  : "Registrar Empresa"
                }
              </Button>

              <Fade in={!!mensaje}>
                <Box>
                  {mensaje && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {mensaje}
                    </Alert>
                  )}
                </Box>
              </Fade>

            </CardContent>
          </Card>
        </Fade>
      </Box>

    </Box>
  );
}