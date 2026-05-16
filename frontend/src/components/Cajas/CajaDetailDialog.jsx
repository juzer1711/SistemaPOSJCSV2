import {
  Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton,
  Box, Grid, Divider, Button, Table, TableHead, TableRow, TableCell,
  TableBody, Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useCajaDetail } from "../../hooks/cajas/useCajaDetail";
import VentaDetailDialog from "../Ventas/VentaDetailDialog";
import { formatDateTime } from "../../utils/formats";

export default function CajaDetailDialog({ open, onClose, caja }) {
  const {
    ventas,
    loadingVentas,
    ventaSeleccionada,
    ventaOpen,
    setVentaOpen,
    movimientos,
    verDetalleVenta,
    diferenciaEfectivo,
    diferenciaTransferencia,
  } = useCajaDetail({ open, caja });

  if (!caja) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle component="div">
        Detalle completo de la Caja #{caja.idCaja}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Información general */}
        <Box mb={3}>
          <Typography variant="h6">Información general</Typography>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={4}>
              <Typography><b>Cajero:</b> {caja.nombreCajero}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography><b>Apertura:</b> {formatDateTime(caja.fechaApertura)}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography><b>Cierre:</b> {formatDateTime(caja.fechaCierre) || "Aún abierta"}</Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Totales del sistema */}
        <Typography variant="h6" gutterBottom>Totales del sistema</Typography>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={3}>
            <Typography><b>Monto inicial:</b> ${caja.montoInicial}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography><b>Total ventas:</b> ${caja.totalVentas}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography><b>Efectivo sistema:</b> ${caja.totalEfectivo}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography><b>Transferencia sistema:</b> ${caja.totalTransferencia}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Conteo real */}
        <Typography variant="h6" gutterBottom>Conteo real del cajero</Typography>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={3}>
            <Typography><b>Efectivo contado:</b> ${caja.efectivoReal || 0}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography><b>Transferencia contada:</b> ${caja.transferenciaReal || 0}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography component="div">
              <b>Diferencia efectivo:</b>{" "}
              <Chip
                label={`$${diferenciaEfectivo}`}
                color={diferenciaEfectivo === 0 ? "success" : "error"}
              />
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography component="div">
              <b>Diferencia transferencia:</b>{" "}
              <Chip
                label={`$${diferenciaTransferencia}`}
                color={diferenciaTransferencia === 0 ? "success" : "error"}
              />
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Ventas */}
        <Typography variant="h6" gutterBottom>Ventas realizadas en esta caja</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID Venta</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Método</TableCell>
              <TableCell>Total</TableCell>
              <TableCell align="center">Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingVentas ? (
              <TableRow>
                <TableCell colSpan={5}>Cargando ventas...</TableCell>
              </TableRow>
            ) : ventas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>No hay ventas en esta caja</TableCell>
              </TableRow>
            ) : (
              ventas.map((venta) => (
                <TableRow key={venta.idVenta}>
                  <TableCell>{venta.idVenta}</TableCell>
                  <TableCell>{venta.fecha}</TableCell>
                  <TableCell>{venta.metodoPago}</TableCell>
                  <TableCell>${venta.total}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => verDetalleVenta(venta.idVenta)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Divider sx={{ my: 3 }} />

        {/* Movimientos */}
        <Typography variant="h6" gutterBottom>Movimientos de Caja</Typography>
        {movimientos.length === 0 ? (
          <Typography variant="body2">No hay movimientos registrados.</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Motivo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movimientos.map((m) => (
                <TableRow key={m.idMovimiento}>
                  <TableCell>{m.fecha}</TableCell>
                  <TableCell>
                    <Chip
                      label={m.tipo}
                      color={m.tipo === "ENTRADA" ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>${Number(m.monto).toLocaleString("es-CO")}</TableCell>
                  <TableCell>{m.motivo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>

      {ventaSeleccionada && (
        <VentaDetailDialog
          open={ventaOpen}
          onClose={() => setVentaOpen(false)}
          venta={ventaSeleccionada}
        />
      )}
    </Dialog>
  );
}