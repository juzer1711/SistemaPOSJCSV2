import useUsers from "../hooks/users/useUserManagement";
import UserTable from "../components/CrudUsuarios/UserTable";
import UserFormDialog from "../components/CrudUsuarios/UserFormDialog";
import UserSearchBar from "../components/CrudUsuarios/UserSearchBar";
import ConfirmDialog from "../components/ConfirmDialog";
import { Box, Typography } from "@mui/material";  // ✅ sin Toolbar, Snackbar, Alert

export default function UserManagement() {
  const u = useUsers();

  return (
    <Box sx={{ p: 3 }}>

      {/* ✅ Toolbar reemplazado por Box simple */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Gestión de Usuarios
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Administra los accesos y roles del sistema
        </Typography>
      </Box>

      <UserSearchBar
        filter={u.filter}
        onFilterChange={u.setFilter}
        onAdd={u.handleAdd}
        showInactive={u.showInactive}
        onToggleInactive={() => u.setShowInactive((prev) => !prev)}
        visibleColumns={u.visibleColumns}
        setVisibleColumns={u.setVisibleColumns}
        sortBy={u.sortBy}
        setSortBy={u.setSortBy}
        advancedFilters={u.advancedFilters}
        setAdvancedFilters={u.setAdvancedFilters}
        handleShowAll={u.handleShowAll}
        ALL_COLUMNS={u.ALL_COLUMNS}
      />

      <UserTable
        users={u.users}
        page={u.page}
        setPage={u.setPage}
        pageSize={u.pageSize}
        setPageSize={u.setPageSize}
        totalRows={u.totalRows}
        onEdit={u.handleEdit}
        onDelete={u.handleInactive}
        onActivate={u.handleActivate}
        visibleColumns={u.visibleColumns}
        loading={u.loading}
        setSortBy={u.setSortBy}
      />

      <UserFormDialog
        open={u.open}
        editing={u.editing}
        selectedId={u.selectedUser?.idUsuario}
        defaultValues={u.selectedUser}
        onClose={() => {
          u.setOpen(false);
          u.setEditing(false);
          u.setSelectedUser(null);
        }}
        loadUsers={u.loadUsers}
        showMessage={u.showMessage}
      />

      <ConfirmDialog
        open={u.dialogOpen}
        title={u.dialogInfo.title}
        message={u.dialogInfo.message}
        confirmText={u.dialogInfo.confirmText}
        confirmColor={u.dialogInfo.confirmColor}
        onClose={() => u.setDialogOpen(false)}
        onConfirm={u.handleConfirm}
      />
    </Box>
  );
}