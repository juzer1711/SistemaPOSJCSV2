import React, { useEffect, useState, useMemo } from "react";
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
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [selectedTipoDocumento, setselectedTipoDocumento] = useState('');

const ALL_COLUMNS = {
  idUsuario: "ID",
  username: "Usuario",
  primerNombre: "Primer Nombre",
  segundoNombre: "Segundo Nombre",
  primerApellido: "Primer Apellido",
  segundoApellido: "Segundo Apellido",
  tipoDocumento: "Tipo Documento",
  documento: "Documento",
  rol: "Rol",
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
  rol: "",
  tipoDocumento: "",
  estado: "", // "activo" | "inactivo" | ""
});

const handleShowAll = () => {
  const all = {};
  Object.keys(visibleColumns).forEach(k => all[k] = true);
  setVisibleColumns(all);
};

  useEffect(() => {
  loadUsers();
}, [showInactive]); // Se ejecuta al montar el componente para cargar la lista de usuarios

  // Función que obtiene la lista de usuarios desde la API
const loadUsers = async () => {
  const res = showInactive 
  ? await getInactiveUsers() 
  : await getActiveUsers();
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
    showMessage("Usuario desactivado correctamente");
  } else {
    await activateUser(selectedId);
    showMessage("Usuario activado correctamente");
  }

  loadUsers();
};

const handleInactive = (id) => {
  openDeactivateDialog(id);
};

const handleActivate = (id) => {
  openActivateDialog(id);
};

const showMessage = (msg, type = "success") => {
  setSnackbar({ open: true, message: msg, severity: type });
};

const filteredSortedUsers = useMemo(() => {
  const q = filter?.trim().toLowerCase();

  // 1) Aplicar showInactive toggle (ya lo cargas por efecto, así que aquí solo filtramos por estado si advancedFilters lo solicita)
  let result = [...users];

  // 2) Aplicar filtros avanzados
  if (advancedFilters.rol) {
    result = result.filter(u => (u.rol.nombre || "").toLowerCase() === advancedFilters.rol.toLowerCase());
  }
  if (advancedFilters.tipoDocumento) {
    result = result.filter(u => (u.tipoDocumento || "").toLowerCase() === advancedFilters.tipoDocumento.toLowerCase());
  }
  if (advancedFilters.estado) {
    const wantActive = advancedFilters.estado === "activo";
    result = result.filter(u => !!u.estado === wantActive);
  }

  // 3) Búsqueda en campos específicos (si q está)
  if (q) {
    result = result.filter((u) => {
      const fields = [
        u.username,
        u.primerNombre,
        u.segundoNombre,
        u.primerApellido,
        u.segundoApellido,
        u.idUsuario?.toString(),
        u.documento,
        u.rol.nombre,
        u.email,
        u.telefono,
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
}, [users, filter, advancedFilters, sortBy]);

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
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        sortBy={sortBy}
        setSortBy={setSortBy}
        advancedFilters={advancedFilters}
        setAdvancedFilters={setAdvancedFilters}
        handleShowAll={handleShowAll}
        ALL_COLUMNS={ALL_COLUMNS}
      />
      <UserTable
      users={filteredSortedUsers}
      onEdit={handleEdit}
      onDelete={handleInactive}
      onActivate={handleActivate}
      visibleColumns={visibleColumns}
      loading={false}
      />


      <UserFormDialog
        open={open}
        editing={editing}
        selectedId={selectedUser?.idUsuario}
        defaultValues={selectedUser}
        onClose={() => {
          setOpen(false);
          setEditing(false);
          setSelectedUser(null);
        }}
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
