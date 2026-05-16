import useClients from "../hooks/clients/useClientManagement";
import ClientTable from "../components/CrudClientes/ClientTable";
import ClientFormDialog from "../components/CrudClientes/ClientFormDialog";
import ClientSearchBar from "../components/CrudClientes/ClientSearchBar";
import ConfirmDialog from "../components/ConfirmDialog";
import { Box, Toolbar, Typography, Snackbar, Alert } from "@mui/material";

const ClientManagement = () => {
  const c = useClients();

  return (
    <Box sx={{ p: 3 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">Gestión de Clientes</Typography>
      </Toolbar>

      <ClientSearchBar
        filter={c.filter}
        onFilterChange={c.setFilter}
        onAdd={c.handleAdd}
        showInactive={c.showInactive}
        onToggleInactive={() => c.setShowInactive(prev => !prev)}
        visibleColumns={c.visibleColumns}
        setVisibleColumns={c.setVisibleColumns}
        sortBy={c.sortBy}
        setSortBy={c.setSortBy}
        advancedFilters={c.advancedFilters}
        setAdvancedFilters={c.setAdvancedFilters}
        handleShowAll={c.handleShowAll}
        ALL_COLUMNS={c.ALL_COLUMNS}
      />

      <ClientTable
        clients={c.clients}
        page={c.page}
        setPage={c.setPage}
        pageSize={c.pageSize}
        setPageSize={c.setPageSize}
        totalRows={c.totalRows}
        loading={false}
        onEdit={c.handleEdit}
        onDelete={c.openDeactivateDialog}
        onActivate={c.openActivateDialog}
        visibleColumns={c.visibleColumns}
      />

      <ClientFormDialog
        open={c.open}
        editing={c.editing}
        selectedId={c.selectedClient?.idCliente}
        defaultValues={c.selectedClient}
        onClose={() => {
          c.setOpen(false);
          c.setEditing(false);
          c.setSelectedClient(null);
        }}
        loadClients={c.loadClients}
        showMessage={c.showMessage}
      />

      <ConfirmDialog
        open={c.dialogOpen}
        title={c.dialogInfo.title}
        message={c.dialogInfo.message}
        confirmText={c.dialogInfo.confirmText}
        confirmColor={c.dialogInfo.confirmColor}
        onClose={() => c.setDialogOpen(false)}
        onConfirm={c.handleConfirm}
      />

      <Snackbar
        open={c.snackbar.open}
        autoHideDuration={2500}
        onClose={() => c.showMessage("")}
      >
        <Alert severity={c.snackbar.severity} variant="filled">
          {c.snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientManagement;