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

  const handlePrint = () => {
    const printContents = document.getElementById("ticket-print").innerHTML;
    const win = window.open("", "", "width=420,height=800");
    win.document.write(`
      <html>
        <head>
          <title>Ticket</title>
          <style>
            body{
              font-family: monospace;
              padding: 10px;
              width: 380px;
            }
            .center{text-align:center;}
            .row{
              display:flex;
              justify-content:space-between;
              font-size:13px;
              margin:2px 0;
            }
            .total{
              font-weight:bold;
              font-size:16px;
            }
            hr{
              border:none;
              border-top:1px dashed #000;
              margin:8px 0;
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ sx: { width: 420, borderRadius: 3 } }}
    >
      <DialogContent dividers sx={{ background: "#fafafa" }}>

        {/* ZONA IMPRIMIBLE */}
        <div id="ticket-print">

          <Box className="center">
            <Typography fontWeight="bold">TU NEGOCIO</Typography>
            <Typography fontSize={13}>COMPROBANTE DE VENTA</Typography>
          </Box>

          <hr />

          <Box className="center">
            <Typography fontSize={13}>
              {cliente.razonSocial ||
                `${cliente.primerNombre} ${cliente.primerApellido}`}
            </Typography>
            <Typography fontSize={12}>Doc: {cliente.documento}</Typography>
            <Typography fontSize={12}>Pago: {metodoPago}</Typography>
          </Box>

          <hr />

          {items.map((i) => (
            <Box key={i.idProducto} className="row">
              <span>{i.nombre} x{i.cantidad}</span>
              <span>${(i.precioUnitario * i.cantidad).toLocaleString()}</span>
            </Box>
          ))}

          <hr />

          <Box className="row">
            <span>Subtotal:</span>
            <span>${totalSinIVA.toLocaleString()}</span>
          </Box>

          <Box className="row">
            <span>IVA:</span>
            <span>${totalIVA.toLocaleString()}</span>
          </Box>

          <hr />

          <Box className="row total">
            <span>TOTAL:</span>
            <span>${total.toLocaleString()}</span>
          </Box>

          {metodoPago === "EFECTIVO" && (
            <>
              <Box className="row">
                <span>Recibido:</span>
                <span>${Number(montoRecibido).toLocaleString()}</span>
              </Box>
              <Box className="row">
                <span>Cambio:</span>
                <span>${cambio.toLocaleString()}</span>
              </Box>
            </>
          )}

          <hr />

          <Box className="center">
            <Typography fontSize={12}>Gracias por su compra</Typography>
          </Box>

        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>

        <Button
          variant="contained"
          onClick={async () => {
            await onConfirm();   // registra venta
            handlePrint();      // abre imprimir / guardar pdf
          }}
          disabled={loadingVenta}
        >
          {loadingVenta ? <CircularProgress size={20} /> : "Confirmar e Imprimir"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutResumenDialog;