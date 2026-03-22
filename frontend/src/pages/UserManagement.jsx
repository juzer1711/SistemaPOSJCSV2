import React, { useEffect, useState } from "react";
import {
  deactivateUser,
  activateUser,
  searchUsers
} from "../services/userService";
import UserTable from "../components/CrudUsuarios/UserTable";
import UserFormDialog from "../components/CrudUsuarios/UserFormDialog";
import UserSearchBar from "../components/CrudUsuarios/UserSearchBar";
import { Box, Toolbar, Typography } from "@mui/material";
import ConfirmDialog from "../components/ConfirmDialog";
import { Snackbar, Alert } from "@mui/material";


export default function UserManagement() {
  const [users, setUsers] = useState([]);// Estado principal donde se guardan los usuarios cargados desde el backend

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);


  const [filter, setFilter] = useState("");// Filtro de búsqueda (texto que escribe el usuario)
  const [debouncedFilter, setDebouncedFilter] = useState("");
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
  nombreCompleto: "Nombre",
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
}, [page,
    pageSize,
    sortBy,
    debouncedFilter,
    advancedFilters,
    showInactive]); // Se ejecuta al montar el componente para cargar la lista de usuarios

  useEffect(() => {
  const timeout = setTimeout(() => {
    setDebouncedFilter(filter);
  }, 400); // 400ms delay (puedes usar 300)

  return () => clearTimeout(timeout);
  }, [filter]);

  const [loading, setLoading] = useState(false);

  // Función que obtiene la lista de usuarios desde la API
const loadUsers = async () => {
try {
      setLoading(true);

      const params = {
        page,
        size: pageSize,
        sort: `${sortBy.key},${sortBy.direction}`,

        // 🔍 búsqueda
        search: debouncedFilter || undefined,

        // filtros avanzados
        rol: advancedFilters.rol || undefined,
        tipoDocumento: advancedFilters.tipoDocumento || undefined,
        // 🔥 activos / inactivos
        estado: showInactive ? false : true
      };

      const res = await searchUsers(params);

      setUsers(res.data.content || []);
      setTotalRows(res.data.totalElements || 0);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
      users={users}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      totalRows={totalRows}
      onEdit={handleEdit}
      onDelete={handleInactive}
      onActivate={handleActivate}
      visibleColumns={visibleColumns}
      loading={loading}
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
