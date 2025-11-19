import React, { useEffect, useState } from "react";
import {
  getActiveUsers,
  getInactiveUsers,
  deactivateUser,
  activateUser
} from "../services/userService";
import UserTable from "../components/CrudUsuarios/UserTable";
import UserFormDialog from "../components/CrudUsuarios/UserFormDialog";
import UserSearchBar from "../components/CrudUsuarios/UserSearchBar";
import { Box, Toolbar, Typography } from "@mui/material";
import ConfirmDialog from "../components/ConfirmDialog";
import { Snackbar, Alert } from "@mui/material";


export default function UserManagement() {
  const [users, setUsers] = useState([]);// Estado principal donde se guardan los usuarios cargados desde el backend
  const [filter, setFilter] = useState("");// Filtro de búsqueda (texto que escribe el usuario)
  const [open, setOpen] = useState(false);// Estado para controlar si el modal (formulario) está abierto o cerrado
  const [editing, setEditing] = useState(false);// Indica si el formulario está en modo "editar" o "agregar"
  const [selectedUser, setSelectedUser] = useState(null);// Guarda el usuario actualmente seleccionado para editar
  const [showInactive, setShowInactive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "success"});



  useEffect(() => {
  loadUsers();
}, [showInactive]); // Se ejecuta al montar el componente para cargar la lista de usuarios

  // Función que obtiene la lista de usuarios desde la API
const loadUsers = async () => {
  const res = showInactive ? await getInactiveUsers() : await getActiveUsers();
  setUsers(res.data);
};


  // Abre el formulario en modo "Agregar nuevo usuario"
  const handleAdd = () => {
    setEditing(false);
    setSelectedUser(null);
    setOpen(true);
  };

  // Abre el formulario en modo "Editar usuario"
  const handleEdit = (user) => {
    setEditing(true);
    setSelectedUser(user);
    setOpen(true);
  };


  // Desactiva un usuario
const openDeactivateDialog = (id) => {
  setSelectedId(id);
  setDialogInfo({
    title: "¿Desactivar usuario?",
    message: "El usuario no podrá iniciar sesión hasta que lo actives nuevamente.",
    confirmText: "Desactivar",
    confirmColor: "error"
  });
  setDialogOpen(true);
};


const openActivateDialog = (id) => {
  setSelectedId(id);
  setDialogInfo({
    title: "¿Activar usuario?",
    message: "El usuario podrá utilizar el sistema nuevamente.",
    confirmText: "Activar",
    confirmColor: "primary"
  });
  setDialogOpen(true);
};

const handleConfirm = async () => {
  setDialogOpen(false);

  if (dialogInfo.confirmText === "Desactivar") {
    await deactivateUser(selectedId);
  } else {
    await activateUser(selectedId);
  }

  loadUsers();
};

const handleDelete = (id) => {
  openDeactivateDialog(id);
};

const handleActivate = (id) => {
  openActivateDialog(id);
};

const showMessage = (msg, type = "success") => {
  setSnackbar({ open: true, message: msg, severity: type });
};

  // Aplica el filtro de búsqueda (nombre, apellido, id, rol o documento)
  const filtered = users.filter((u) =>
    `${u.nombre} ${u.apellido} ${u.idUsuario} ${u.rol.nombre} ${u.documento}`.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">Gestión de Usuarios</Typography>
      </Toolbar>

      <UserSearchBar
        filter={filter}
        onFilterChange={setFilter}
        onAdd={handleAdd}
        showInactive={showInactive}
        onToggleInactive={() => setShowInactive(prev => !prev)}
      />
      <UserTable
        users={filtered}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onActivate={handleActivate}
      />


      <UserFormDialog
        open={open}
        editing={editing}
        selectedId={selectedUser?.idUsuario}
        defaultValues={selectedUser}
        onClose={() => setOpen(false)}
        loadUsers={loadUsers}
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
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>

  );
}
