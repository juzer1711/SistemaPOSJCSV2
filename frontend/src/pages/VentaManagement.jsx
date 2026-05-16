import { Box, Toolbar, Typography } from "@mui/material";
import { useVentaManagement } from "../hooks/ventas/useVentaManagement";
import VentaTable from "../components/Ventas/VentaTable";
import VentaSearchBar from "../components/Ventas/VentaSearchBar";
import VentaDetailDialog from "../components/Ventas/VentaDetailDialog";
import ConfirmDialog from "../components/ConfirmDialog";

export default function VentaManagement() {
  const {
    // Datos
    ventas,
    ventaSeleccionada,
    // Paginación
    page,
    setPage,
    pageSize,
    setPageSize,
    totalRows,
    loading,
    // Búsqueda y filtros
    filter,
    setFilter,
    showInactive,
    setShowInactive,
    advancedFilters,
    setAdvancedFilters,
    sortBy,
    setSortBy,
    // Columnas
    ALL_COLUMNS,
    visibleColumns,
    setVisibleColumns,
    handleShowAll,
    // Dialog confirmación
    dialogOpen,
    setDialogOpen,
    dialogInfo,
    handleConfirm,
    // Dialog detalle
    detailOpen,
    setDetailOpen,
    // Handlers
    handleOpenPOS,
    handleInactive,
    handleActivate,
    verDetalle,
  } = useVentaManagement();

  return (
    <Box sx={{ p: 3 }}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          mb: 2,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Gestión de Ventas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consulta, administra y revisa las ventas registradas
          </Typography>
        </Box>
      </Toolbar>

      <VentaSearchBar
        filter={filter}
        onFilterChange={setFilter}
        onAddVenta={handleOpenPOS}
        showInactive={showInactive}
        onToggleInactive={() => setShowInactive((p) => !p)}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        sortBy={sortBy}
        setSortBy={setSortBy}
        advancedFilters={advancedFilters}
        setAdvancedFilters={setAdvancedFilters}
        handleShowAll={handleShowAll}
        ALL_COLUMNS={ALL_COLUMNS}
      />

      <VentaTable
        ventas={ventas}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalRows={totalRows}
        onView={verDetalle}
        onDeactivate={handleInactive}
        onActivate={handleActivate}
        visibleColumns={visibleColumns}
        loading={loading}
      />

      <VentaDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        venta={ventaSeleccionada}
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
    </Box>
  );
}