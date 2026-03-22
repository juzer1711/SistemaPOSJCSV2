import { useEffect, useState } from "react";
import { Box, Typography, Button, Card, CardContent, Grid, TextField, MenuItem, Snackbar, Alert} from "@mui/material";

import { getCajasAbiertas, abrirCaja, cerrarCaja } from "../services/cajaService";
import { getActiveUsers } from "../services/userService";

export default function CajaManagement() {

  const [cajas, setCajas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [montoInicial, setMontoInicial] = useState("");

  const [snackbar, setSnackbar] = useState({
    open:false,
    message:"",
    severity:"success"
  });

  const showMessage = (msg,type="success")=>{
    setSnackbar({open:true,message:msg,severity:type});
  };

  const loadCajas = async () => {
    try {
      const res = await getCajasAbiertas();
      setCajas(res.data || []);
    } catch (e) {
      console.log(e);
    }
    };

    const loadUsuarios = async () => {
    try {
        const res = await getActiveUsers();
        setUsuarios(res.data || []);
    } catch (e) {
        console.log(e);
    }
    };

  useEffect(()=>{
    loadCajas();
    loadUsuarios();
  },[]);

  const handleAbrirCaja = async () => {

    try {

      const data = {
        idUsuario: usuarioSeleccionado,
        montoInicial: montoInicial
      };

      await abrirCaja(data);

      showMessage("Caja abierta correctamente");

      setUsuarioSeleccionado("");
      setMontoInicial("");

      loadCajas();

    } catch (error) {

      showMessage(error.message,"error");

    }

  };

  const handleCerrarCaja = async (idCaja) => {

    try {

      await cerrarCaja(idCaja,{
        montoFinal:0
      });

      showMessage("Caja cerrada");

      loadCajas();

    } catch (error) {

      showMessage(error.message,"error");

    }

  };

  return (
    <Box sx={{p:3}}>

        <Typography variant="h6" fontWeight="bold" mb={4}>
            Gestión de Cajas
        </Typography>

        <Card sx={{mb:3}}>
        <CardContent>

          <Typography variant="h6" mb={2}>
            Abrir Caja
          </Typography>

          <Grid container spacing={2}>

            <Grid size={{xs:4}}>
              <TextField
                select
                fullWidth
                label="Cajero"
                value={usuarioSeleccionado}
                onChange={(e)=>setUsuarioSeleccionado(e.target.value)}
              >
                {usuarios.map(u => (
                <MenuItem key={u.idUsuario} value={u.idUsuario}>
                    {u.primerNombre} {u.primerApellido}
                </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{xs:4}}>
              <TextField
                label="Monto inicial"
                type="number"
                fullWidth
                value={montoInicial}
                onChange={(e)=>setMontoInicial(e.target.value)}
              />
            </Grid>

            <Grid size={{xs:4}}>
              <Button
                variant="contained"
                fullWidth
                sx={{height:"100%"}}
                onClick={handleAbrirCaja}
              >
                Abrir Caja
              </Button>
            </Grid>

          </Grid>

        </CardContent>
      </Card>

      <Card>
        <CardContent>

          <Typography variant="h6" mb={2}>
            Cajas Abiertas
          </Typography>

          {cajas.map(caja=>(
            <Box
              key={caja.idCaja}
              sx={{
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center",
                borderBottom:"1px solid #eee",
                py:1
              }}
            >

              <Box>

                <Typography fontWeight="bold">
                  Caja #{caja.idCaja}
                </Typography>

                <Typography variant="body2">
                  Cajero: {caja.nombreCajero}
                </Typography>

                <Typography variant="body2">
                  Apertura: {caja.fechaApertura}
                </Typography>

              </Box>

              <Button
                variant="outlined"
                color="error"
                onClick={()=>handleCerrarCaja(caja.idCaja)}
              >
                Cerrar Caja
              </Button>

            </Box>
          ))}

        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={()=>setSnackbar({...snackbar,open:false})}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );

}