import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, Box, Divider
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

const DialogCerrarCaja = ({
  open,
  onClose,
  cajaActiva,
  onConfirm
}) => {

  const [efectivoReal, setEfectivoReal] = useState("");
  const [transferenciaReal, setTransferenciaReal] = useState("");
  const [step, setStep] = useState(1);

  const totalSistema =
    Number(cajaActiva?.totalEfectivo || 0) +
    Number(cajaActiva?.totalTransferencia || 0);

  const totalReal =
    Number(efectivoReal || 0) +
    Number(transferenciaReal || 0);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Cerrar Caja</DialogTitle>

      <DialogContent>

        {/* 🔥 STEP 1 */}
        {step === 1 && (
          <>
            <Typography sx={{ mb: 2 }}>
              Ingresa el conteo real
            </Typography>

            <TextField
              label="Efectivo contado"
              type="number"
              fullWidth
              sx={{ mb: 2 }}
              value={efectivoReal}
              onChange={(e)=>setEfectivoReal(e.target.value)}
            />

            <TextField
              label="Transferencia real"
              type="number"
              fullWidth
              value={transferenciaReal}
              onChange={(e)=>setTransferenciaReal(e.target.value)}
            />
          </>
        )}

        {/* 🔥 STEP 2 (CUADRE) */}
        {step === 2 && (
          <>
            <Typography variant="h6">Resumen</Typography>

            <Box sx={{ mt:2 }}>
              <Typography>
                Sistema: ${totalSistema.toLocaleString()}
              </Typography>

              <Typography>
                Real: ${totalReal.toLocaleString()}
              </Typography>

              <Typography
                color={totalReal === totalSistema ? "green" : "red"}
                fontWeight="bold"
              >
                Diferencia: ${(totalReal - totalSistema).toLocaleString()}
              </Typography>
            </Box>
          </>
        )}

      </DialogContent>

      <DialogActions>

        {step === 1 && (
          <Button
            variant="contained"
            onClick={() => setStep(2)}
            disabled={!efectivoReal || !transferenciaReal}
          >
            Continuar
          </Button>
        )}

        {step === 2 && (
          <>
            <Button onClick={() => setStep(1)}>
              Volver
            </Button>

            <Button
              color="error"
              variant="contained"
              onClick={() => onConfirm(efectivoReal, transferenciaReal)}
            >
              Confirmar Cierre
            </Button>
          </>
        )}

      </DialogActions>
    </Dialog>
  );
};
export default DialogCerrarCaja;