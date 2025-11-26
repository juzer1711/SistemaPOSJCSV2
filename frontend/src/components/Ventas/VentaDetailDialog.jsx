import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Button, Divider, Box
} from "@mui/material";

const VentaDetailDialog = ({ open, onClose, venta }) => {

  if (!venta) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>

      <DialogTitle>
        <Typography fontWeight="bold">
          Detalle de Venta #{venta.idVenta}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>

        {/* Información general */}
        <Box sx={{ mb:2 }}>
          <Typography><b>Cliente:</b> {venta.nombreCliente}</Typography>
          <Typography><b>Documento:</b> {venta.documentoCliente}</Typography>
          <Typography><b>Fecha:</b> {new Date(venta.fecha).toLocaleString()}</Typography>
          <Typography><b>Método de Pago:</b> {venta.metodoPago}</Typography>
          {venta.observaciones && (
            <Typography><b>Observaciones:</b> {venta.observaciones}</Typography>
          )}
        </Box>

        <Divider sx={{ my:2 }}/>

        {/* Tabla de items */}
        <Typography variant="h6" sx={{ mb:1 }}>Productos facturados</Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio Unit.</TableCell>
              <TableCell>Subtotal</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {venta.items.map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item.nombreProducto}</TableCell>
                <TableCell>{item.cantidad}</TableCell>
                <TableCell>${item.precioUnitario.toFixed(2)}</TableCell>
                <TableCell><b>${item.subtotal.toFixed(2)}</b></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider sx={{ my:2 }}/>

        <Typography variant="h5" textAlign="right" fontWeight="bold">
          Total: ${venta.total.toFixed(2)}
        </Typography>

      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">Cerrar</Button>
      </DialogActions>

    </Dialog>
  );
};

export default VentaDetailDialog;
