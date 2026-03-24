import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Divider, Box, Button, Paper
} from "@mui/material";

import CircularProgress from "@mui/material/CircularProgress";

const CheckoutResumenDialog = ({
  open,
  onClose,
  cliente,
  metodoPago,
  observaciones,
  items,
  montoRecibido,
  total,
  totalIVA,
  totalSinIVA,
  cambio,
  loadingVenta,
  onConfirm
}) => {
  if (!cliente) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>

      {/* CABECERA */}
      <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
        <Typography variant="h5" component="div" fontWeight="bold">
          🧾 Confirmar Venta
        </Typography>

        <Typography
          variant="subtitle2"
          component="div"
          color="text.secondary"
        >
          Revisa antes de continuar
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ background: "#fafafa" }}>

        {/* DATOS DEL CLIENTE */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography fontWeight="bold" fontSize={17}>
            {cliente.razonSocial ||
              `${cliente.primerNombre} ${cliente.primerApellido}`}
          </Typography>
          <Typography fontSize={14} color="text.secondary">
            Documento: {cliente.documento}
          </Typography>

          <Typography fontSize={14} color="text.secondary">
            Pago: {metodoPago}
          </Typography>

          {observaciones && (
            <Typography fontSize={13} fontStyle="italic" sx={{ mt: 1 }}>
              "{observaciones}"
            </Typography>
          )}
        </Box>

        <Divider sx={{ borderStyle: "dashed", mb: 2 }} />

        {/* PRODUCTOS */}
        <Typography fontWeight="bold" sx={{ mb: 1 }}>Productos</Typography>

        {items.map((i) => (
          <Box key={i.idProducto} sx={{
            display: "flex",
            justifyContent: "space-between",
            py: 0.6,
            borderBottom: "1px dashed #ccc"
          }}>
            <span>{i.nombre} (x{i.cantidad})</span>
            <b>${(i.precioUnitario * i.cantidad).toLocaleString()}</b>
          </Box>
        ))}

        <Divider sx={{ borderStyle: "dashed", my: 2 }} />

        {/* TOTALES */}
        <Paper elevation={0} sx={{
          p: 2, borderRadius: "12px",
          background: "#fff",
          border: "1px solid #ddd"
        }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>Subtotal:</Typography>
            <Typography>${totalSinIVA.toLocaleString()}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>IVA:</Typography>
            <Typography>${totalIVA.toLocaleString()}</Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="h6" fontWeight="bold">Total a pagar:</Typography>
            <Typography variant="h6" fontWeight="bold" color="primary">
              ${total.toLocaleString()}
            </Typography>
          </Box>

          {metodoPago === "EFECTIVO" && (
            <>
              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Recibido:</Typography>
                <Typography>${Number(montoRecibido).toLocaleString()}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Cambio:</Typography>
                <Typography color="green" fontWeight="bold">
                  ${cambio.toLocaleString()}
                </Typography>
              </Box>
            </>
          )}
        </Paper>

        <Divider sx={{ borderStyle: "dashed", mt: 2 }} />

        <Typography textAlign="center" fontSize={13} color="text.secondary" sx={{ mt: 1 }}>
          Confirma para registrar la venta
        </Typography>

      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancelar</Button>

      <Button
        variant="contained"
        color="success"
        onClick={onConfirm}
        disabled={loadingVenta}
      >
        {loadingVenta ? <CircularProgress size={20} color="inherit" /> : "Confirmar Venta"}
      </Button>
      </DialogActions>

    </Dialog>
  );
};

export default CheckoutResumenDialog;
