import {
  Paper, Typography, Autocomplete, TextField,
  Button, MenuItem, Select, FormControl, Box,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useCheckout } from "../../hooks/pos/useCheckout";
import CheckoutResumenDialog from "./CheckoutResumenDialog";

const CheckoutPanel = ({
  clientes = [],
  items = [],
  clienteSeleccionado, setClienteSeleccionado,
  metodoPago, setMetodoPago,
  montoRecibido, setMontoRecibido,
  observaciones, setObservaciones,
  clearCart, reloadProductos, cajaActiva,
}) => {
  const {
    total,
    totalIVA,
    totalSinIVA,
    cambio,
    loadingVenta,
    openResumen,
    setOpenResumen,
    handleConfirm,
  } = useCheckout({
    items,
    clienteSeleccionado,
    metodoPago,
    montoRecibido,
    observaciones,
    setClienteSeleccionado,
    setMetodoPago,
    setMontoRecibido,
    setObservaciones,
    clearCart,
    reloadProductos,
  });

  const getClientName = (c) =>
    c?.razonSocial ?? `${c?.primerNombre ?? ""} ${c?.primerApellido ?? ""}`.trim();

  return (
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
        <Typography variant="h6">Checkout</Typography>
        {cajaActiva && (
          <Typography variant="body2" color="text.secondary">
            Caja #{cajaActiva.idCaja} — {cajaActiva.nombreCajero}
          </Typography>
        )}
      </Box>

      {/* CONTENIDO */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* CLIENTE */}
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
          <Typography fontWeight={600} mb={1}>Cliente</Typography>
          <Autocomplete
            options={clientes}
            value={clienteSeleccionado}
            isOptionEqualToValue={(o, v) => o.idCliente === v?.idCliente}
            onChange={(e, val) => setClienteSeleccionado(val)}
            getOptionLabel={(c) => `${getClientName(c)} | ${c?.documento ?? ""}`}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
        </Box>

        {/* PAGO */}
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
          <Typography fontWeight={600} mb={1}>Método de pago</Typography>
          <FormControl fullWidth size="small">
            <Select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
              <MenuItem value="EFECTIVO">Efectivo</MenuItem>
              <MenuItem value="TRANSFERENCIA">Transferencia</MenuItem>
            </Select>
          </FormControl>

          {metodoPago === "EFECTIVO" && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                size="small"
                label="Monto recibido"
                type="number"
                value={montoRecibido}
                onChange={(e) => setMontoRecibido(e.target.value)}
              />
              <Typography mt={1} fontWeight={600}>
                Cambio: ${cambio.toLocaleString("es-CO")}
              </Typography>
            </Box>
          )}
        </Box>

        {/* OBSERVACIONES */}
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
          <Typography fontWeight={600} mb={1}>Observaciones</Typography>
          <TextField
            fullWidth
            multiline
            minRows={2}
            size="small"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </Box>
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h4" fontWeight="bold" color="primary">
            ${total.toLocaleString("es-CO")}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="success"
          fullWidth
          size="large"
          onClick={() => setOpenResumen(true)}
          disabled={
            loadingVenta ||
            !clienteSeleccionado ||
            items.length === 0 ||
            !metodoPago ||
            (metodoPago === "EFECTIVO" &&
              (!montoRecibido || Number(montoRecibido) < total))
          }
        >
          {loadingVenta ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Ver resumen y cobrar"
          )}
        </Button>
      </Box>

      <CheckoutResumenDialog
        open={openResumen}
        onClose={() => setOpenResumen(false)}
        cliente={clienteSeleccionado}
        metodoPago={metodoPago}
        observaciones={observaciones}
        items={items}
        total={total}
        totalIVA={totalIVA}
        totalSinIVA={totalSinIVA}
        montoRecibido={montoRecibido}
        cambio={cambio}
        loadingVenta={loadingVenta}
        onConfirm={handleConfirm}
      />
    </Paper>
  );
};

export default CheckoutPanel;