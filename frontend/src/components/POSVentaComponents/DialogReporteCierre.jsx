import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Typography
} from "@mui/material";
import { formatDateTime, formatMoney } from "../../utils/formats";

const DialogReporteCierre = ({ open, reporte, onClose }) => {

  const handlePrint = () => {
    window.print();
  };

  if (!reporte) return null;

  return (
    <Dialog open={open} maxWidth="xs">
      <DialogContent>

        {/* TIRILLA */}
        <Box id="ticket-cierre" sx={{ fontFamily: "monospace", fontSize: 13 }}>

          <Typography align="center" fontWeight="bold">
            MI PAPELERÍA
          </Typography>
          <Typography align="center" fontWeight="bold">
            CIERRE DE CAJA
          </Typography>

          <br />

          <Typography>Caja: {reporte.idCaja}</Typography>
          <Typography>Cajero: {reporte.nombreCajero}</Typography>
          <Typography>
            Fecha apertura: {formatDateTime(reporte.fechaApertura)}
          </Typography>
          <Typography>
            Fecha cierre: {formatDateTime(reporte.fechaCierre)}
          </Typography>

          <Typography>--------------------------------</Typography>

          <Typography>
            Monto inicial: {formatMoney(reporte.montoInicial)}
          </Typography>
          <Typography>
            Ventas totales: {formatMoney(reporte.totalVentas)}
          </Typography>
          <Typography>
            Efectivo sistema: {formatMoney(reporte.totalEfectivo)}
          </Typography>
          <Typography>
            Transfer sistema: {formatMoney(reporte.totalTransferencia)}
          </Typography>

          <Typography>--------------------------------</Typography>

          <Typography>
            Efectivo real: {formatMoney(reporte.efectivoReal)}
          </Typography>
          <Typography>
            Transfer real: {formatMoney(reporte.transferenciaReal)}
          </Typography>

          <Typography>--------------------------------</Typography>

          <Typography>
            Dif. efectivo: {formatMoney(reporte.diferenciaEfectivo)}
          </Typography>
          <Typography>
            Dif. transfer: {formatMoney(reporte.diferenciaTransferencia)}
          </Typography>

          <Typography>--------------------------------</Typography>

          <Typography align="center" fontWeight="bold">
            CIERRE OK
          </Typography>
        </Box>

        <br />

        <Button fullWidth variant="contained" onClick={handlePrint}>
          Imprimir / Guardar PDF
        </Button>

        <Button fullWidth onClick={onClose} sx={{ mt: 1 }}>
          Cerrar
        </Button>

      </DialogContent>
    </Dialog>
  );
};

export default DialogReporteCierre;