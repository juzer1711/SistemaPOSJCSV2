import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../services/userService";
import UserTable from "../components/CrudUsuarios/UserTable";
import UserFormDialog from "../components/CrudUsuarios/UserFormDialog";
import UserSearchBar from "../components/CrudUsuarios/UserSearchBar";
import { Box, Toolbar, Typography } from "@mui/material";

export default function UserManagement() {
  const [users, setUsers] = useState([]);// Estado principal donde se guardan los usuarios cargados desde el backend
  const [filter, setFilter] = useState("");// Filtro de búsqueda (texto que escribe el usuario)
  const [open, setOpen] = useState(false);// Estado para controlar si el modal (formulario) está abierto o cerrado
  const [editing, setEditing] = useState(false);// Indica si el formulario está en modo "editar" o "agregar"
  const [selectedUser, setSelectedUser] = useState(null);// Guarda el usuario actualmente seleccionado para editar

  useEffect(() => { loadUsers(); }, []); // Se ejecuta al montar el componente para cargar la lista de usuarios

  // Función que obtiene la lista de usuarios desde la API
  const loadUsers = async () => {
    const res = await getUsers();
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

  // Elimina un usuario tras confirmar con el usuario
  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar usuario?")) {
      await deleteUser(id);
      loadUsers();
    }
  };

  // Aplica el filtro de búsqueda (nombre, apellido, id, rol o documento)
  const filtered = users.filter((u) =>
    `${u.nombre} ${u.apellido} ${u.idUsuario} ${u.role} ${u.documento}`.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">Gestión de Usuarios</Typography>
      </Toolbar>

      <UserSearchBar filter={filter} onFilterChange={setFilter} onAdd={handleAdd} />
      <UserTable users={filtered} onEdit={handleEdit} onDelete={handleDelete} />

      <UserFormDialog
        open={open}
        editing={editing}
        selectedId={selectedUser?.idUsuario}
        defaultValues={selectedUser}
        onClose={() => setOpen(false)}
        loadUsers={loadUsers}
      />
    </Box>
  );
}
