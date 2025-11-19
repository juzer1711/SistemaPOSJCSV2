import React, { useState, useEffect } from "react";
import { getActiveClients, getInactiveClients, deactivateClient, activateClient } from "../services/clientService";
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


  const filtered = clients.filter((c) =>
    `${c.nombre} ${c.apellido} ${c.idCliente} ${c.documento}`.toLowerCase().includes(filter.toLowerCase())
  );


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
    />

    {/* === TABLA DE CLIENTES === */}
    <ClientTable
      clients={filtered}
      onEdit={handleEdit}
      onDelete={handleInactive}
      onActivate={handleActivate}
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

