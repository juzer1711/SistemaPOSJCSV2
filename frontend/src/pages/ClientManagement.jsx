import React, { useState, useEffect } from "react";
import { getActiveClients, getInactiveClients, deactivateClient, activateClient } from "../services/clientservice";
import ClientTable from "../components/CrudClientes/ClientTable";
import ClientFormDialog from "../components/CrudClientes/ClientFormDialog";
import ClientSearchBar from "../components/CrudClientes/ClientSearchBar";
import { Box, Button } from "@mui/material";
import ConfirmDialog from "../components/ConfirmDialog";  // Usando tu ConfirmDialog existente
import SuccessDialog from "../components/SuccessDialog";  // Usando tu SuccessDialog existente

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [showInactive, setShowInactive] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Función que recarga los clientes
  const loadClients = async () => {
    const response = showInactive ? await getInactiveClients() : await getActiveClients();
    setClients(response.data);
  };

  // Función que muestra los mensajes de éxito o error
  const showMessage = (message, type) => {
    if (type === "success") {
      setSuccessMessage(message);
      setSuccessDialogOpen(true);
    } else {
      // Aquí podrías manejar los errores si lo necesitas
      console.error(message);
    }
  };

  useEffect(() => {
    const loadClients = async () => {
      const response = showInactive ? await getInactiveClients() : await getActiveClients();
      setClients(response.data);
    };

    loadClients();
  }, [showInactive]);

  const handleSearch = async (searchTerm) => {
    setFilter(searchTerm);
    if (searchTerm) {
      const response = await getActiveClients();
      setClients(response.data.filter((client) => client.nombre.includes(searchTerm) || client.documento.includes(searchTerm) || client.email.includes(searchTerm)));
    } else {
      const response = await getActiveClients();
      setClients(response.data);
    }
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
      setSuccessMessage("Cliente desactivado correctamente.");
    } else {
      await activateClient(selectedId);
      setSuccessMessage("Cliente activado correctamente.");
    }

    setSuccessDialogOpen(true);

    const response = await getActiveClients();
    setClients(response.data);
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
  };

  const toggleInactive = () => setShowInactive(!showInactive);

    const handleEdit = (client) => {
    // Cuando se hace clic en el botón de editar, se marca que estamos en modo de edición
    setEditing(true); // Esto indica que estamos editando, no creando un nuevo cliente
    setSelectedClient(client); // Guardamos los datos del cliente que se está editando
    setOpen(true); // Abrimos el formulario de edición
    };

  return (
    <Box>
      <Button onClick={() => setOpen(true)}>Agregar Cliente</Button>
      <Button onClick={toggleInactive}>
        {showInactive ? "Mostrar Activos" : "Mostrar Inactivos"}
      </Button>

      <ClientSearchBar onSearch={handleSearch} />

      <ClientTable
        clients={clients}
        onEdit={handleEdit}
        onDelete={openDeactivateDialog}
        onActivate={openActivateDialog}
      />

      <ClientFormDialog
        open={open}
        editing={editing}
        selectedId={selectedClient?.idCliente}
        defaultValues={selectedClient}
        onClose={() => setOpen(false)}
        loadClients={loadClients}  
        showMessage={showMessage}
      />

      {/* ConfirmDialog para desactivar/activar cliente */}
      <ConfirmDialog
        open={dialogOpen}
        title={dialogInfo.title}
        message={dialogInfo.message}
        confirmText={dialogInfo.confirmText}
        confirmColor={dialogInfo.confirmColor}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirm}
      />

      {/* SuccessDialog para mostrar mensaje de éxito */}
      <SuccessDialog
        open={successDialogOpen}
        message={successMessage}
      />
    </Box>
  );
};

export default ClientManagement;

