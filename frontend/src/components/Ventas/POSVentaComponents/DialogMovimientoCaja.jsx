import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent,
  TextField, MenuItem, Button, DialogActions,
  Box
} from "@mui/material";
import { registrarMovimientoCaja } from "../../../services/movimientosCajaService";

export default function DialogMovimientoCaja({ open, onClose, cajaActiva }) {
  const [tipo, setTipo] = useState("ENTRADA");
  const [monto, setMonto] = useState("");
  const [motivo, setMotivo] = useState("");

  const handleGuardar = async () => {
    try {
      await registrarMovimientoCaja({
        idCaja: cajaActiva.idCaja,
        idUsuario: localStorage.getItem("id_usuario"),
        tipo,
        monto,
        motivo
      });

      onClose();
      setMonto("");
      setMotivo("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>

      <DialogTitle>Movimiento de Caja</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
        <TextField
          select
          label="Tipo de movimiento"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <MenuItem value="ENTRADA">Entrada</MenuItem>
          <MenuItem value="SALIDA">Salida</MenuItem>
        </TextField>

        <TextField
          label="Monto"
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />

        <TextField
          label="Motivo"
          multiline
          rows={3}
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleGuardar}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}