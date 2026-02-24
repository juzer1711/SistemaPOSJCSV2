import React, { useState, useEffect, useMemo } from "react";
import { 
  getActiveClients, 
  getInactiveClients, 
  deactivateClient, 
  activateClient 
} from "../services/clientService";
import ClientTable from "../components/CrudClientes/ClientTable";
import ClientFormDialog from "../components/CrudClientes/ClientFormDialog";
import ClientSearchBar from "../components/CrudClientes/ClientSearchBar";
import { Box, Toolbar, Typography } from "@mui/material";
import ConfirmDialog from "../components/ConfirmDialog"; 
import { Snackbar, Alert } from "@mui/material";


const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showInactive, setShowInactive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [snackbar, setSnackbar] = useState({open: false,message: "",severity: "success",});
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [selectedTipoDocumento, setselectedTipoDocumento] = useState('');


const ALL_COLUMNS = {
  idCliente: "ID",
  tipoCliente: "Tipo Cliente",
  primerNombre: "Primer Nombre",
  segundoNombre: "Segundo Nombre",
  primerApellido: "Primer Apellido",
  segundoApellido: "Segundo Apellido",
  razonSocial: "Razón Social",
  tipoDocumento: "Tipo Documento",
  documento: "Documento",
  identificadorNit: "DV",
  direccion: "Dirección",
  email: "Email",
  telefono: "Teléfono",
  estado: "Estado",
  acciones: "Acciones",
};


const [visibleColumns, setVisibleColumns] = useState(() => {
  const defaults = {};
  Object.keys(ALL_COLUMNS).forEach((k) => (defaults[k] = true));
  return defaults;
});

const [sortBy, setSortBy] = useState({ key: "primerApellido", direction: "asc" }); // default
const [advancedFilters, setAdvancedFilters] = useState({
  tipoCliente: "", // e.g. "Persona Natural" | "Empresa"
  tipoDocumento: "",
  estado: "", // "activo" | "inactivo" | ""
  // otros filtros que quieras
});

const handleShowAll = () => {
  const all = {};
  Object.keys(visibleColumns).forEach(k => all[k] = true);
  setVisibleColumns(all);
};

    useEffect(() => {
    loadClients();
  }, [showInactive]);

  // Función que recarga los clientes
  const loadClients = async () => {
  const res = showInactive
    ? await getInactiveClients()
    : await getActiveClients();
  setClients(res.data);
};

  // Abre el formulario en modo "Agregar nuevo cliente"
  const handleAdd = () => {
    setEditing(false);
    setSelectedClient(null);
    setOpen(true);
  };

  const handleEdit = (client) => {
    setEditing(true); // Esto indica que estamos editando, no creando un nuevo cliente
    setSelectedClient(client); // Guardamos los datos del cliente que se está editando
    setOpen(true); // Abrimos el formulario de edición
    };


    const openDeactivateDialog = (id) => {
    setSelectedId(id);
    setDialogInfo({
      title: "¿Desactivar cliente?",
      message: "El cliente no podrá acceder a sus datos una vez desactivado.",
      confirmText: "Desactivar",
      confirmColor: "error",
    });
    setDialogOpen(true);
  };

  
  const openActivateDialog = (id) => {
    setSelectedId(id);
    setDialogInfo({
      title: "¿Activar cliente?",
      message: "El cliente podrá acceder a sus datos nuevamente.",
      confirmText: "Activar",
      confirmColor: "primary",
    });
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    setDialogOpen(false);

    if (dialogInfo.confirmText === "Desactivar") {
      await deactivateClient(selectedId);
      showMessage("Cliente desactivado correctamente");
    } else {
      await activateClient(selectedId);
      showMessage("Cliente activado correctamente");
    }
    loadClients();  
  };

  const handleInactive = (id) => {
    openDeactivateDialog(id);
  };

  const handleActivate = (id) => {
    openActivateDialog(id);
  };

    // Función que muestra los mensajes de éxito 
  const showMessage = (msg, type = "success") => {
    setSnackbar({ open: true, message: msg, severity: type });
  };


  const filteredSortedClients = useMemo(() => {
  const q = filter?.trim().toLowerCase();

  // 1) Aplicar showInactive toggle (ya lo cargas por efecto, así que aquí solo filtramos por estado si advancedFilters lo solicita)
  let result = [...clients];

  // 2) Aplicar filtros avanzados
  if (advancedFilters.tipoCliente) {
    result = result.filter(c => (c.tipoCliente || "").toLowerCase() === advancedFilters.tipoCliente.toLowerCase());
  }
  if (advancedFilters.tipoDocumento) {
    result = result.filter(c => (c.tipoDocumento || "").toLowerCase() === advancedFilters.tipoDocumento.toLowerCase());
  }
  if (advancedFilters.estado) {
    const wantActive = advancedFilters.estado === "activo";
    result = result.filter(c => !!c.estado === wantActive);
  }

  // 3) Búsqueda en campos específicos (si q está)
  if (q) {
    result = result.filter((c) => {
      const fields = [
        c.primerNombre,
        c.segundoNombre,
        c.primerApellido,
        c.segundoApellido,
        c.razonSocial,
        c.idCliente?.toString(),
        c.documento,
        c.tipoCliente,
        c.email,
        c.telefono,
      ];
      return fields.some(f => (f || "").toString().toLowerCase().includes(q));
    });
  }

  // 4) Ordenar
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

  return result;
}, [clients, filter, advancedFilters, sortBy]);


  return (
  <Box sx={{ p: 3 }}>
    {/* === ENCABEZADO === */}
    <Toolbar sx={{ justifyContent: "space-between" }}>
      <Typography variant="h6">Gestión de Clientes</Typography>
    </Toolbar>

    {/* === BARRA DE BUSQUEDA + ACCIONES === */}
    <ClientSearchBar
      filter={filter}
      onFilterChange={setFilter}
      onAdd={handleAdd}
      showInactive={showInactive}
      onToggleInactive={() => setShowInactive(prev => !prev)}
      visibleColumns={visibleColumns}
      setVisibleColumns={setVisibleColumns}
      sortBy={sortBy}
      setSortBy={setSortBy}
      advancedFilters={advancedFilters}
      setAdvancedFilters={setAdvancedFilters}
      handleShowAll={handleShowAll}
      ALL_COLUMNS={ALL_COLUMNS}
    />

    {/* === TABLA DE CLIENTES === */}

    <ClientTable
      clients={filteredSortedClients}
      onEdit={handleEdit}
      onDelete={handleInactive}
      onActivate={handleActivate}
      visibleColumns={visibleColumns}
      loading={false}
    />


    {/* === FORMULARIO AL CREAR/EDITAR === */}
    <ClientFormDialog
      open={open}
      editing={editing}
      selectedId={selectedClient?.idCliente}
      defaultValues={selectedClient}
      onClose={() => {
        setOpen(false);
        setEditing(false);
        setSelectedClient(null);
      }}
      loadClients={loadClients}
      showMessage={showMessage}
    />

    {/* === CONFIRMACIONES === */}
    <ConfirmDialog
      open={dialogOpen}
      title={dialogInfo.title}
      message={dialogInfo.message}
      confirmText={dialogInfo.confirmText}
      confirmColor={dialogInfo.confirmColor}
      onClose={() => setDialogOpen(false)}
      onConfirm={handleConfirm}
    />

    {/* === MENSAJE DE ÉXITO === */}
    <Snackbar
      open={snackbar.open}
      autoHideDuration={2500}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
    >
      <Alert
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        variant="filled"
      >
        {snackbar.message}
      </Alert>
    </Snackbar>

  </Box>

  );
};

export default ClientManagement;

