import { useEffect, useState } from "react";
import {
  deactivateUser,
  activateUser,
  searchUsers
} from "../../services/userService";

import { useSnackbar } from "../../context/SnackBarProvider";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const { showSnackbar } = useSnackbar();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const [filter, setFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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

  const [sortBy, setSortBy] = useState({ key: "primerApellido", direction: "asc" });
  const [advancedFilters, setAdvancedFilters] = useState({
    rol: "",
    tipoDocumento: "",
    estado: "",
  });

  const handleShowAll = () => {
    const all = {};
    Object.keys(visibleColumns).forEach(k => all[k] = true);
    setVisibleColumns(all);
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [page, pageSize, sortBy, debouncedFilter, advancedFilters, showInactive]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 400);

    return () => clearTimeout(timeout);
  }, [filter]);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        size: pageSize,
        sort: `${sortBy.key},${sortBy.direction}`,
        search: debouncedFilter || undefined,
        rol: advancedFilters.rol || undefined,
        tipoDocumento: advancedFilters.tipoDocumento || undefined,
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

  const handleAdd = () => {
    setEditing(false);
    setSelectedUser(null);
    setOpen(true);
  };

  const handleEdit = (user) => {
    setEditing(true);
    setSelectedUser(user);
    setOpen(true);
  };

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

  const handleInactive = (id) => openDeactivateDialog(id);
  const handleActivate = (id) => openActivateDialog(id);

  const showMessage = (msg, type = "success") => {
    showSnackbar(msg, type);
  };

  return {
    users, page, setPage, pageSize, setPageSize, totalRows,
    filter, setFilter, open, editing, selectedUser,
    showInactive, setShowInactive,
    dialogOpen, dialogInfo,
    visibleColumns, setVisibleColumns,
    sortBy, setSortBy,
    advancedFilters, setAdvancedFilters,
    handleShowAll,
    loading,
    handleAdd, handleEdit,
    handleInactive, handleActivate,
    handleConfirm,
    setOpen, setEditing, setSelectedUser,
    setDialogOpen,
    showMessage,
    loadUsers,
    ALL_COLUMNS
  };
}