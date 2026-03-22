import { useState, useEffect } from "react";
import { Box, Toolbar, Typography, Snackbar, Alert, Dialog } from "@mui/material";
import { useNavigate } from "react-router-dom";
import VentaTable from "../components/Ventas/VentaTable";
import VentaSearchBar from "../components/Ventas/VentaSearchBar";
import VentaDetailDialog from "../components/Ventas/VentaDetailDialog";
import { getVentaById, deactivateVenta, activateVenta, searchVentas } from "../services/ventaService";
import { getActiveProducts } from "../services/productService";
import { getActiveClients } from "../services/clientService";
import ConfirmDialog from "../components/ConfirmDialog";

export default function VentaManagement () {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const [filter, setFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({});
  const [selectedId, setSelectedId] = useState(null);

  const [snackbar, setSnackbar] = useState({ open:false, message:"", severity:"success" });
  const [detailOpen, setDetailOpen] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  const handleOpenPOS = () => {
    navigate("/nueva-venta");
  };


  const ALL_COLUMNS = {
  idVenta: "ID",
  fecha: "Fecha",
  nombreCliente: "Cliente",
  documentoCliente: "Documento",
  idCaja: "Caja",
  nombreCajero: "Cajero",
  metodoPago: "Método de Pago",
  total: "Total",
  totalIVA: "IVA Total",
  estado: "Estado",
  acciones: "Acciones",
  };

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const defaults = {};
    Object.keys(ALL_COLUMNS).forEach((k) => (defaults[k] = true));
    return defaults;
  });
  
  const [sortBy, setSortBy] = useState({ key: "fecha", direction: "desc" }); // default
  const [advancedFilters, setAdvancedFilters] = useState({
    metodoPago: ""
  });
  
  const handleShowAll = () => {
    const all = {};
    Object.keys(visibleColumns).forEach(k => all[k] = true);
    setVisibleColumns(all);
  };

  useEffect(() => {
    loadVentas();
  }, [
    page,
    pageSize,
    sortBy,
    debouncedFilter,
    advancedFilters,
    showInactive
  ]);

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
        const res = await getActiveClients();
        setClientes(res.data || []);
      } catch (e) { console.log(e); }
    };
    cargarClientes();
  }, []);

  useEffect(() => {
  const timeout = setTimeout(() => {
    setDebouncedFilter(filter);
  }, 400); // 400ms delay 

  return () => clearTimeout(timeout);
}, [filter]);

  const [loading, setLoading] = useState(false);

  const loadVentas = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        size: pageSize,
        sort: `${sortBy.key},${sortBy.direction}`,

        // 🔍 búsqueda
        search: debouncedFilter || undefined,

        // filtros avanzados
        metodoPago: advancedFilters.metodoPago || undefined,
        fechaInicio: advancedFilters.fechaInicio || undefined,
        fechaFin: advancedFilters.fechaFin || undefined,

        // 🔥 activos / inactivos
        estado: showInactive ? false : true
      };

      const res = await searchVentas(params);

      setVentas(res.data.content || []);
      setTotalRows(res.data.totalElements || 0);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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


  const verDetalle = async (id) => {
  const res = await getVentaById(id);
  setVentaSeleccionada(res.data);
  setDetailOpen(true);
  };

  return (
    <Box sx={{ p:3 }}>
      
      <Toolbar
        sx={{
          justifyContent: "space-between",
          mb: 2,
          borderBottom: "1px solid #e0e0e0"
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Gestión de Ventas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consulta, administra y revisa las ventas registradas
          </Typography>
        </Box>
      </Toolbar>

      <VentaSearchBar 
        filter={filter}
        onFilterChange={setFilter}
        onAddVenta={handleOpenPOS}
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
        ventas={ventas}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalRows={totalRows}
        onView={verDetalle}
        onDeactivate={handleInactive}
        onActivate={handleActivate}
        visibleColumns={visibleColumns}
        loading={loading}
      />

      <VentaDetailDialog 
      open={detailOpen} 
      onClose={()=>setDetailOpen(false)}
      venta={ventaSeleccionada}
      />

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

