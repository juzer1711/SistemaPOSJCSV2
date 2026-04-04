import { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardContent, Grid,
  TextField, MenuItem, Button, Divider, Autocomplete
} from "@mui/material";

import {
  getCajasAbiertas,
  getCajasCerradas,
  searchCajas,
  abrirCaja,
  getCajaById,
  forzarCierreCaja
} from "../services/cajaService";

import { searchUsers } from "../services/userService";
import CajaDetailDialog from "../components/Cajas/CajaDetailDialog";
import CajasAbiertasGrid from "../components/Cajas/CajasAbiertasGrid";
import HistorialCajasGrid from "../components/Cajas/HistorialCajasGrid";
import { formatDateTime } from "../utils/formats";


export default function CajaManagement() {

  // 🔹 Estados principales
  const [usuarios, setUsuarios] = useState([]);
  const [cajasAbiertas, setCajasAbiertas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [cajaSeleccionada, setCajaSeleccionada] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // ================= PAGINACIONES =================
  const [pageAbiertas, setPageAbiertas] = useState(0);
  const [pageHistorial, setPageHistorial] = useState(0);
  const size = 10;
  const [totalRowsAbiertas, setTotalRowsAbiertas] = useState(0);
  const [totalRowsHistorial, setTotalRowsHistorial] = useState(0);

  // 🔹 Form abrir caja
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [montoInicial, setMontoInicial] = useState("");

  // ================= FILTROS =================
  const [filtroAbiertas, setFiltroAbiertas] = useState({
    cajero: "",
    fecha: ""
  });

  const [filtroHistorial, setFiltroHistorial] = useState({
    fechaInicio: "",
    fechaFin: "",
    cajero: ""
  });

  const [loadingAbiertas, setLoadingAbiertas] = useState(false);
  const [loadingCerradas, setLoadingCerradas] = useState(false);
  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);



  // ================== LOADERS ==================

  useEffect(() => {
  loadUsuarios();
}, []);

useEffect(() => {
  const delayDebounce = setTimeout(() => {
    loadUsuarios();
  }, 400);

  return () => clearTimeout(delayDebounce);
}, [busquedaUsuario]);

  useEffect(() => {
    loadCajasAbiertas();
  }, [pageAbiertas, filtroAbiertas]);

  useEffect(() => {
    loadHistorial();
  }, [pageHistorial, filtroHistorial]);

const loadUsuarios = async () => {
  try {
    setLoadingUsuarios(true);

    const res = await searchUsers({
      page: 0,
      size: 20,
      search: busquedaUsuario || undefined,
    });

    setUsuarios(res.data.content || []);
  } finally {
    setLoadingUsuarios(false);
  }
};

const loadCajasAbiertas = async () => {
  try{
    setLoadingAbiertas(true);

  const res = await searchCajas({
    page: pageAbiertas,
    size,
    search: filtroAbiertas.cajero || undefined,
    fechaApertura: filtroAbiertas.fecha || undefined,
    estado: "ABIERTA",
  });

  setCajasAbiertas(res.data.content);
  setTotalRowsAbiertas(res.data.totalElements);
} finally {setLoadingAbiertas(false);}
};

const loadHistorial = async () => {
  try{setLoadingCerradas(true);
  const res = await searchCajas({
    page: pageHistorial,
    size,
    search: filtroHistorial.cajero || undefined,
    fechaApertura: filtroHistorial.fechaInicio || undefined,
    fechaCierre: filtroHistorial.fechaFin || undefined,
    estado: "CERRADA",
  });

  setHistorial(res.data.content);
  setTotalRowsHistorial(res.data.totalElements);
  } finally {setLoadingCerradas(false);}
};

  // ================== ACCIONES ==================

  const handleAbrirCaja = async () => {
    await abrirCaja({
      idUsuario: usuarioSeleccionado,
      montoInicial
    });

    setUsuarioSeleccionado("");
    setMontoInicial("");

    loadCajasAbiertas();
  };

  const handleCerrarCaja = async (idCaja) => {
    await forzarCierreCaja(idCaja);
    loadCajasAbiertas();
    loadHistorial();
  };

  const verDetalleCaja = async (idCaja) => {
    const res = await getCajaById(idCaja);
    setCajaSeleccionada(res.data);
    setDetailOpen(true);
  };



  // ================== UI ==================

 return (
  <Box sx={{ p: 4 }}>

    <Typography variant="h5" fontWeight="bold" mb={3}>
      Panel Administrativo de Cajas
    </Typography>

    {/* 🟦 Abrir Caja */}
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" mb={2}>
          Abrir caja a un cajero
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Autocomplete
              fullWidth
              size="small"
              options={usuarios}
              getOptionLabel={(u) =>
                `${u.primerNombre} ${u.primerApellido} - ${u.documento}`
              }
              value={usuarios.find(u => u.idUsuario === usuarioSeleccionado) || null}
              onChange={(e, newValue) =>
                setUsuarioSeleccionado(newValue?.idUsuario || "")
              }
              onInputChange={(e, newInputValue) =>
                setBusquedaUsuario(newInputValue)
              }
              loading={loadingUsuarios}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar cajero"
                  placeholder="Nombre, apellido, documento o id"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Monto inicial"
              value={montoInicial}
              onChange={(e) => setMontoInicial(e.target.value)}
            />
          </Grid>

          <Grid item xs={3}>
            <Button fullWidth variant="contained" onClick={handleAbrirCaja}>
              Abrir Caja
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>

    {/* 🟩 CAJAS ABIERTAS CON DATAGRID */}
      
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" mb={2}>
          Cajas abiertas ahora mismo
        </Typography>
         {/* ===== FILTROS ABIERTAS ===== */}
    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
      <TextField
        label="Cajero"
        size="small"
        value={filtroAbiertas.cajero}
        onChange={(e) =>
          setFiltroAbiertas({ ...filtroAbiertas, cajero: e.target.value })
        }
      />

      <TextField
        type="date"
        size="small"
        value={filtroAbiertas.fecha}
        onChange={(e) =>
          setFiltroAbiertas({ ...filtroAbiertas, fecha: e.target.value })
        }
      />
    </Box>

    <CajasAbiertasGrid
      rows={cajasAbiertas}
      totalRows={totalRowsAbiertas}
      page={pageAbiertas}
      onPageChange={setPageAbiertas}
      onVerDetalle={verDetalleCaja}
      onForzarCierre={handleCerrarCaja}
      loading={loadingAbiertas}
    />
      </CardContent>
    </Card>

    {/* 🟨 HISTORIAL CON DATAGRID */}
    <Card>
      <CardContent>
        <Typography variant="h6" mb={2}>
          Historial de cajas cerradas
        </Typography>
            {/* ===== FILTROS HISTORIAL ===== */}
    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
      <TextField
        label="Cajero"
        size="small"
        value={filtroHistorial.cajero}
        onChange={(e) =>
          setFiltroHistorial({ ...filtroHistorial, cajero: e.target.value })
        }
      />

      <TextField
        type="date"
        label="Desde"
        size="small"
        InputLabelProps={{ shrink: true }}
        value={filtroHistorial.fechaInicio}
        onChange={(e) =>
          setFiltroHistorial({
            ...filtroHistorial,
            fechaInicio: e.target.value,
          })
        }
      />

      <TextField
        type="date"
        label="Hasta"
        size="small"
        InputLabelProps={{ shrink: true }}
        value={filtroHistorial.fechaFin}
        onChange={(e) =>
          setFiltroHistorial({
            ...filtroHistorial,
            fechaFin: e.target.value,
          })
        }
      />
    </Box>

    <HistorialCajasGrid
      rows={historial}
      totalRows={totalRowsHistorial}
      page={pageHistorial}
      onPageChange={setPageHistorial}
      onVerDetalle={verDetalleCaja}
      loading={loadingCerradas}
    />
      </CardContent>
    </Card>

    <CajaDetailDialog
      open={detailOpen}
      onClose={() => setDetailOpen(false)}
      caja={cajaSeleccionada}
    />

  </Box>
);
}