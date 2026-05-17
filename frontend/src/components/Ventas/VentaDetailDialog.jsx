import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Button, Divider, Box, Paper
} from "@mui/material";

const VentaDetailDialog = ({ open, onClose, venta }) => {

  if (!venta) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          overflow: "hidden",
        }
      }}
    >

      {/* ENCABEZADO */}
      <DialogTitle
        sx={{
          px: 3,
          py: 2.5,
          borderBottom: "1px solid #E2E8F0",
          backgroundColor: "#FFFFFF",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          color="#0F172A"
        >
          Detalle de Venta
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Factura #{venta.idVenta}
        </Typography>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          backgroundColor: "#F8FAFC",
          px: 3,
          py: 3,
        }}
      >

        {/* INFO CLIENTE */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: "20px",
            border: "1px solid #E2E8F0",
            backgroundColor: "#FFFFFF",
            textAlign: "center",
          }}
        >
          <Typography fontWeight="bold" fontSize={17}>
            {venta.nombreCliente}
          </Typography>
          <Typography fontSize={14} color="text.secondary">
            Documento: {venta.documentoCliente}
          </Typography>
          <Typography fontSize={14} color="text.secondary">
            Fecha: {new Date(venta.fecha).toLocaleString()}
          </Typography>
          <Typography fontSize={14} color="text.secondary">
            Pago: {venta.metodoPago}
          </Typography>

          {venta.observaciones && (
            <Typography fontStyle="italic" fontSize={13} sx={{ mt: 1 }}>
              "{venta.observaciones}"
            </Typography>
          )}
        </Paper>

        {/* SEPARADOR TIPO TICKET */}
        <Divider sx={{ borderStyle: "dashed", mb: 2 }} />

        {/* TABLA DE PRODUCTOS */}
        <Typography fontWeight="bold" sx={{ mb: 1 }}>Productos</Typography>

        <Table
          size="small"
          sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <TableHead
            sx={{
              backgroundColor: "#F8FAFC",
            }}
          >
            <TableRow>
              <TableCell><b>Producto</b></TableCell>
              <TableCell align="center"><b>Cant</b></TableCell>
              <TableCell align="right"><b>Total</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {venta.items.map((item, i) => (
              <TableRow
                key={i}
                sx={{
                  "& td": {
                    borderBottom: "1px solid #F1F5F9",
                  },
                }}
              >
                <TableCell>
                  {item.nombreProducto}

                  <Typography
                    fontSize={12}
                    color="text.secondary"
                  >
                    PU: ${item.precioUnitario?.toLocaleString("es-CO")}
                    &nbsp;| IVA: {(item.ivaPorcentaje * 100)}%
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  {item.cantidad}
                </TableCell>

                <TableCell align="right">
                  <b>
                    ${item.subtotal?.toLocaleString("es-CO")}
                  </b>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* SEPARADOR TIPO TICKET */}
        <Divider sx={{ borderStyle: "dashed", my: 2 }} />

        {/* TOTALES MEJORADOS */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "20px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E2E8F0",
          }}
        >

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>Total sin IVA:</Typography>
            <Typography>${venta.totalSinIVA?.toLocaleString("es-CO")}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>IVA:</Typography>
            <Typography>${venta.totalIVA?.toLocaleString("es-CO")}</Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="h6" fontWeight="bold">Total pagado:</Typography>
            <Typography variant="h6" fontWeight="bold" color="primary">
              ${venta.total?.toLocaleString("es-CO")}
            </Typography>
          </Box>

          {venta.metodoPago === "EFECTIVO" && (
            <>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Monto recibido:</Typography>
                <Typography>
                  ${venta.montoRecibido?.toLocaleString("es-CO")}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Cambio:</Typography>
                <Typography color="green" fontWeight="bold">
                  ${venta.cambio?.toLocaleString("es-CO")}
                </Typography>
              </Box>
            </>
          )}
        </Paper>

        {/* SEPARADOR TIPO TICKET */}
        <Divider sx={{ borderStyle: "dashed", mt: 2 }} />

        <Typography
          textAlign="center"
          fontSize={13}
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Gracias por su compra 💙
        </Typography>

      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid #E2E8F0",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            py: 1.2,
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VentaDetailDialog;