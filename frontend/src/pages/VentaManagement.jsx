import { useState, useEffect, useMemo } from "react";
import { Box, Toolbar, Typography, Snackbar, Alert, Dialog } from "@mui/material";
import VentaTable from "../components/Ventas/VentaTable";
import VentaSearchBar from "../components/Ventas/VentaSearchBar";
import POSVenta from "../components/Ventas/POSVenta";
import VentaDetailDialog from "../components/Ventas/VentaDetailDialog";
import { getActiveVentas, getInactiveVentas, getVentaById, deactivateVenta, activateVenta, registrarVenta } from "../services/ventaService";
import { getActiveProducts } from "../services/productService";
import { getActiveClients } from "../services/clientService";
import ConfirmDialog from "../components/ConfirmDialog";

const VentaManagement = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [filter, setFilter] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({});
  const [selectedId, setSelectedId] = useState(null);

  const [snackbar, setSnackbar] = useState({ open:false, message:"", severity:"success" });
  const [detailOpen, setDetailOpen] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  const [openPOS, setOpenPOS] = useState(false);


  const ALL_COLUMNS = {
  idVenta: "ID",
  nombreCliente: "Cliente",
  documentoCliente: "Documento",
  fecha: "Fecha",
  total: "Total",
  metodoPago: "Método de Pago",
  estado: "Estado",
  acciones: "Acciones",
  };

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const defaults = {};
    Object.keys(ALL_COLUMNS).forEach((k) => (defaults[k] = true));
    return defaults;
  });
  
  const [sortBy, setSortBy] = useState({ key: "fecha", direction: "asc" }); // default
  const [advancedFilters, setAdvancedFilters] = useState({
    metodoPago: "",
    estado: ""
  });
  
  const handleShowAll = () => {
    const all = {};
    Object.keys(visibleColumns).forEach(k => all[k] = true);
    setVisibleColumns(all);
  };

  useEffect(() => { loadVentas(); }, [showInactive]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await getActiveProducts();
        setProductos(res.data || []); // seguro aunque venga null
      } catch (error) {
        console.error("Error cargando productos", error);
      }
    };
    cargar();
  }, []);

useEffect(() => {
  const cargarClientes = async () => {
    try {
      const res = await getActiveClients(); // ojo si ya existe el service
      setClientes(res.data || []);
    } catch (e) { console.log(e); }
  };
  cargarClientes();
}, []);

  const loadVentas = async () => {
    const res = showInactive ? await getInactiveVentas() : await getActiveVentas();
    setVentas(res.data);
  };

const openDeactivateDialog = (id) => {
  setSelectedId(id);
  setDialogInfo({
    title: "¿Desactivar venta?",
    message: "La venta no podrá ser vista hasta que lo actives nuevamente.",
    confirmText: "Desactivar",
    confirmColor: "error"
  });
  setDialogOpen(true);
};


const openActivateDialog = (id) => {
  setSelectedId(id);
  setDialogInfo({
    title: "¿Activar Venta?",
    message: "La venta podrá ser vista en el sistema nuevamente.",
    confirmText: "Activar",
    confirmColor: "primary"
  });
  setDialogOpen(true);
};

  const handleConfirm = async () => {
    setDialogOpen(false);

    if (dialogInfo.confirmText === "Desactivar") {
      await deactivateVenta(selectedId);
      showMessage("Venta desactivada");
    } else {
      await activateVenta(selectedId);
      showMessage("Venta activada");
    }
    loadVentas();
  };

const handleInactive = (id) => {
  openDeactivateDialog(id);
};

const handleActivate = (id) => {
  openActivateDialog(id);
};

const showMessage = (msg, type="success") =>
    setSnackbar({ open:true, message:msg, severity:type });

const filteredVentas = useMemo(() => {
  const q = filter?.trim().toLowerCase();

  // 1) Lista base
  let result = [...ventas];

  // 2) Filtros avanzados
  if (advancedFilters.metodoPago) {
    result = result.filter(v => 
      (v.metodoPago || "").toLowerCase() === advancedFilters.metodoPago.toLowerCase()
    );
  }

  if (advancedFilters.estado) { // activo / inactivo
    const wantActive = advancedFilters.estado === "activo";
    result = result.filter(v => !!v.estado === wantActive);
  }

  // 3) Búsqueda general
  if (q) {
    result = result.filter(v => {
      const fields = [
        v.nombreCliente,
        v.documentoCliente,
        v.idVenta?.toString(),
        v.metodoPago,
      ];

      return fields.some(f => (f || "").toString().toLowerCase().includes(q));
    });
  }

  // 4) Ordenamiento dinámico
  const { key, direction } = sortBy || {};
  if (key) {
    result.sort((a, b) => {
      const A = (a[key] || "").toString().toLowerCase();
      const B = (b[key] || "").toString().toLowerCase();
      if (A < B) return direction === "asc" ? -1 : 1;
      if (A > B) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  // 📅 FILTRAR POR RANGO DE FECHAS
  if (advancedFilters.fechaInicio) {
    result = result.filter(v => new Date(v.fecha) >= new Date(advancedFilters.fechaInicio));
  }
  if (advancedFilters.fechaFin) {
    result = result.filter(v => new Date(v.fecha) <= new Date(advancedFilters.fechaFin));
  }


  return result;
}, [ventas, filter, advancedFilters, sortBy]);

  const verDetalle = async (id) => {
  const res = await getVentaById(id);
  setVentaSeleccionada(res.data);
  setDetailOpen(true);
  };

  return (
    <Box sx={{ p:3 }}>
      
      <Toolbar sx={{ justifyContent:"space-between" }}>
        <Typography variant="h6">Gestión de Ventas</Typography>
      </Toolbar>

      <VentaSearchBar 
        filter={filter}
        onFilterChange={setFilter}
        onAddVenta={() => setOpenPOS(true)}
        showInactive={showInactive}
        onToggleInactive={() => setShowInactive(p=>!p)}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        sortBy={sortBy}
        setSortBy={setSortBy}
        advancedFilters={advancedFilters}
        setAdvancedFilters={setAdvancedFilters}
        handleShowAll={handleShowAll}
        ALL_COLUMNS={ALL_COLUMNS}
      />

      <VentaTable
        ventas={filteredVentas}
        onView={verDetalle}
        onDeactivate={handleInactive}
        onActivate={handleActivate}
        visibleColumns={visibleColumns}
        loading={false}
      />

      <VentaDetailDialog 
      open={detailOpen} 
      onClose={()=>setDetailOpen(false)}
      venta={ventaSeleccionada}
      />

      <Dialog open={openPOS} onClose={()=>setOpenPOS(false)} fullScreen>
        <POSVenta 
            productos={productos}
            clientes={clientes}
            registrarVenta={registrarVenta}
        />
      </Dialog>

      <ConfirmDialog
      open={dialogOpen}
      title={dialogInfo.title}
      message={dialogInfo.message}
      confirmText={dialogInfo.confirmText}
      confirmColor={dialogInfo.confirmColor}
      onClose={() => setDialogOpen(false)}
      onConfirm={handleConfirm}
    />

      <Snackbar open={snackbar.open} autoHideDuration={2200}
        onClose={()=>setSnackbar({...snackbar, open:false})}>
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default VentaManagement;
