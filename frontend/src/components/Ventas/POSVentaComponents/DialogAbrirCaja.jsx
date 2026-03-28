import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography
} from "@mui/material";
import { useState } from "react";

const DialogAbrirCaja = ({
  open,
  onClose,
  onConfirm
}) => {
  const [montoInicial, setMontoInicial] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Dialog open={open} disableEscapeKeyDown>
      <DialogTitle>Abrir Caja</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Debes abrir una caja para comenzar a vender
        </Typography>

        <TextField
          label="Monto inicial"
          type="number"
          fullWidth
          sx={{ mb: 2 }}
          value={montoInicial}
          onChange={(e)=>setMontoInicial(e.target.value)}
        />

        <TextField
          label="Confirmar contraseña"
          type="password"
          fullWidth
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          fullWidth
          onClick={() => onConfirm(montoInicial, password)}
        >
          Abrir Caja
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogAbrirCaja;