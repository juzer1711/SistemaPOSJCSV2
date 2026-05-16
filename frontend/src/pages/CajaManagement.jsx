import {
  Box, Typography, Card, CardContent, Grid,
  TextField, Button, Autocomplete,
} from "@mui/material";
import { useCajaManagement } from "../hooks/cajas/useCajaManagement";
import CajaDetailDialog from "../components/Cajas/CajaDetailDialog";
import CajasAbiertasGrid from "../components/Cajas/CajasAbiertasGrid";
import HistorialCajasGrid from "../components/Cajas/HistorialCajasGrid";

export default function CajaManagement() {
  const {
    // Datos
    usuarios,
    cajasAbiertas,
    historial,
    cajaSeleccionada,
    // Paginación
    pageAbiertas,
    setPageAbiertas,
    pageHistorial,
    setPageHistorial,
    totalRowsAbiertas,
    totalRowsHistorial,
    // Filtros
    filtroAbiertas,
    setFiltroAbiertas,
    filtroHistorial,
    setFiltroHistorial,
    // Formulario abrir caja
    form,
    setForm,
    errores,
    setErrores,
    saving,
    // Búsqueda usuario
    setBusquedaUsuario,
    loadingUsuarios,
    // Loading grids
    loadingAbiertas,
    loadingCerradas,
    // Dialog
    detailOpen,
    setDetailOpen,
    // Handlers
    handleAbrirCaja,
    handleCerrarCaja,
    verDetalleCaja,
  } = useCajaManagement();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Panel Administrativo de Cajas
      </Typography>

      {/* 🟦 Abrir Caja */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Abrir caja a un cajero
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Autocomplete
                sx={{ width: 230 }}
                options={usuarios}
                value={form.usuario}
                loading={loadingUsuarios}
                onChange={(e, newValue) => {
                  setForm({ ...form, usuario: newValue });
                  setErrores({ ...errores, usuario: undefined });
                }}
                onInputChange={(e, value) => setBusquedaUsuario(value)}
                getOptionLabel={(u) =>
                  u ? `${u.primerNombre} ${u.primerApellido} - ${u.documento}` : ""
                }
                isOptionEqualToValue={(option, value) =>
                  option.idUsuario === value?.idUsuario
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Buscar cajero"
                    error={!!errores.usuario}
                    helperText={errores.usuario}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                sx={{ width: 230 }}
                label="Monto inicial"
                value={form.montoInicial}
                onChange={(e) => {
                  setForm({ ...form, montoInicial: e.target.value });
                  setErrores({ ...errores, montoInicial: undefined });
                }}
                error={!!errores.montoInicial}
                helperText={errores.montoInicial}
              />
            </Grid>

            <Grid item xs={3}>
              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={handleAbrirCaja}
                disabled={saving}
              >
                {saving ? "Abriendo..." : "Abrir Caja"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {errores.general && (
        <Typography color="error" mt={1}>
          {errores.general}
        </Typography>
      )}

      {/* 🟩 Cajas abiertas */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Cajas abiertas ahora mismo
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Cajero"
              size="small"
              value={filtroAbiertas.cajero}
              onChange={(e) =>
                setFiltroAbiertas({ ...filtroAbiertas, cajero: e.target.value })
              }
            />
            <TextField
              type="date"
              size="small"
              value={filtroAbiertas.fecha}
              onChange={(e) =>
                setFiltroAbiertas({ ...filtroAbiertas, fecha: e.target.value })
              }
            />
          </Box>

          <CajasAbiertasGrid
            rows={cajasAbiertas}
            totalRows={totalRowsAbiertas}
            page={pageAbiertas}
            onPageChange={setPageAbiertas}
            onVerDetalle={verDetalleCaja}
            onForzarCierre={handleCerrarCaja}
            loading={loadingAbiertas}
          />
        </CardContent>
      </Card>

      {/* 🟨 Historial */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Historial de cajas cerradas
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Cajero"
              size="small"
              value={filtroHistorial.cajero}
              onChange={(e) =>
                setFiltroHistorial({ ...filtroHistorial, cajero: e.target.value })
              }
            />
            <TextField
              type="date"
              label="Desde"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filtroHistorial.fechaInicio}
              onChange={(e) =>
                setFiltroHistorial({
                  ...filtroHistorial,
                  fechaInicio: e.target.value,
                })
              }
            />
            <TextField
              type="date"
              label="Hasta"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filtroHistorial.fechaFin}
              onChange={(e) =>
                setFiltroHistorial({
                  ...filtroHistorial,
                  fechaFin: e.target.value,
                })
              }
            />
          </Box>

          <HistorialCajasGrid
            rows={historial}
            totalRows={totalRowsHistorial}
            page={pageHistorial}
            onPageChange={setPageHistorial}
            onVerDetalle={verDetalleCaja}
            loading={loadingCerradas}
          />
        </CardContent>
      </Card>

      <CajaDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        caja={cajaSeleccionada}
      />
    </Box>
  );
}