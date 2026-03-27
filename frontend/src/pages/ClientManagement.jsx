import React, { useEffect, useState } from "react";
import { 
  searchClients, 
  deactivateClient, 
  activateClient 
} from "../services/clientService";

import ClientTable from "../components/CrudClientes/ClientTable";
import ClientFormDialog from "../components/CrudClientes/ClientFormDialog";
import ClientSearchBar from "../components/CrudClientes/ClientSearchBar";

import { Box, Toolbar, Typography, Snackbar, Alert } from "@mui/material";
import ConfirmDialog from "../components/ConfirmDialog";

const ClientManagement = () => {

  const [clients, setClients] = useState([]);

  // PAGINACIÓN
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  // filtros
  const [filter, setFilter] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const [sortBy, setSortBy] = useState({ key: "primerApellido", direction: "asc" });

  const [advancedFilters, setAdvancedFilters] = useState({
    tipoCliente: "",
    tipoDocumento: "",
    estado: ""
  });

  // UI
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({});
  const [selectedId, setSelectedId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // columnas
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

  const handleShowAll = () => {
    const all = {};
    Object.keys(visibleColumns).forEach(k => all[k] = true);
    setVisibleColumns(all);
  };

  // CARGAR CLIENTES DESDE BACKEND
  const loadClients = async () => {
    try {
      const params = {
        page,
        size: pageSize,
        sort: `${sortBy.key},${sortBy.direction}`,

        search: filter || undefined,

        tipoCliente: advancedFilters.tipoCliente || undefined,
        tipoDocumento: advancedFilters.tipoDocumento || undefined,

        estado: showInactive ? false : true
      };

      const res = await searchClients(params);

      setClients(res.data.content || []);
      setTotalRows(res.data.totalElements || 0);

    } catch (error) {
      console.error(error);
    }
  };

  // AUTO RECARGA
  useEffect(() => {
    loadClients();
  }, [page, pageSize, sortBy, filter, advancedFilters, showInactive]);

  // AGREGAR
  const handleAdd = () => {
    setEditing(false);
    setSelectedClient(null);
    setOpen(true);
  };

  // EDITAR
  const handleEdit = (client) => {
    setEditing(true);
    setSelectedClient(client);
    setOpen(true);
  };

  // DESACTIVAR
  const openDeactivateDialog = (id) => {
    setSelectedId(id);
    setDialogInfo({
      title: "¿Desactivar cliente?",
      message: "El cliente no podrá acceder a sus datos.",
      confirmText: "Desactivar",
      confirmColor: "error",
    });
    setDialogOpen(true);
  };

  // ACTIVAR
  const openActivateDialog = (id) => {
    setSelectedId(id);
    setDialogInfo({
      title: "¿Activar cliente?",
      message: "El cliente podrá acceder nuevamente.",
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

  const showMessage = (msg, type = "success") => {
    setSnackbar({ open: true, message: msg, severity: type });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">Gestión de Clientes</Typography>
      </Toolbar>

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

      <ClientTable
        clients={clients}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalRows={totalRows}
        loading={false}
        onEdit={handleEdit}
        onDelete={openDeactivateDialog}
        onActivate={openActivateDialog}
        visibleColumns={visibleColumns}
      />

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

      <ConfirmDialog
        open={dialogOpen}
        title={dialogInfo.title}
        message={dialogInfo.message}
        confirmText={dialogInfo.confirmText}
        confirmColor={dialogInfo.confirmColor}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirm}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientManagement;

