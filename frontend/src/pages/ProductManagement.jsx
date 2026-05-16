import useProducts from "../hooks/products/useProductManagement";
import ProductTable from "../components/CrudProductos/ProductTable";
import ProductFormDialog from "../components/CrudProductos/ProductFormDialog";
import ProductSearchBar from "../components/CrudProductos/ProductSearchBar";
import CategoriaFormDialog from "../components/CrudProductos/CategoriaFormDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import { Box, Toolbar, Typography, Snackbar, Alert } from "@mui/material";

const ProductManagement = () => {
  const p = useProducts();

  return (
    <Box sx={{ p: 3 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">Gestión de Productos</Typography>
      </Toolbar>

      <ProductSearchBar
        filter={p.filter}
        onFilterChange={p.setFilter}
        onAdd={p.handleAdd}
        showInactive={p.showInactive}
        onToggleInactive={() => p.setShowInactive(prev => !prev)}
        visibleColumns={p.visibleColumns}
        setVisibleColumns={p.setVisibleColumns}
        sortBy={p.sortBy}
        setSortBy={p.setSortBy}
        advancedFilters={p.advancedFilters}
        setAdvancedFilters={p.setAdvancedFilters}
        handleShowAll={p.handleShowAll}
        ALL_COLUMNS={p.ALL_COLUMNS}
        categorias={p.categorias}
        onEditCategoria={p.handleEditCategoria}
        onAddCategoria={p.handleAddCategoria}
      />

      <ProductTable
        products={p.products}
        page={p.page}
        setPage={p.setPage}
        pageSize={p.pageSize}
        setPageSize={p.setPageSize}
        totalRows={p.totalRows}
        loading={false}
        onEdit={p.handleEdit}
        onDelete={p.openDeactivateDialog}
        onActivate={p.openActivateDialog}
      />

      <ProductFormDialog
        open={p.open}
        editing={p.editing}
        selectedId={p.selectedProduct?.idProducto}
        defaultValues={p.selectedProduct}
        onClose={() => {
          p.setOpen(false);
          p.setEditing(false);
          p.setSelectedProduct(null);
        }}
        loadProducts={p.loadProducts}
        categorias={p.categorias}
        showMessage={p.showMessage}
      />

      <CategoriaFormDialog
        open={p.openCategoria}
        editing={p.editingCategoria}
        selectedId={p.selectedCategoria?.idCategoria}
        defaultValues={p.selectedCategoria}
        onClose={() => {
          p.setOpenCategoria(false);
          p.setEditingCategoria(false);
          p.setSelectedCategoria(null);
        }}
        loadProducts={p.loadProducts}
        loadCategorias={p.loadCategorias}
        showMessage={p.showMessage}
      />

      <ConfirmDialog
        open={p.dialogOpen}
        title={p.dialogInfo.title}
        message={p.dialogInfo.message}
        confirmText={p.dialogInfo.confirmText}
        confirmColor={p.dialogInfo.confirmColor}
        onClose={() => p.setDialogOpen(false)}
        onConfirm={p.handleConfirm}
      />

      <Snackbar
        open={p.snackbar.open}
        autoHideDuration={2500}
        onClose={() => p.showMessage("")}
      >
        <Alert severity={p.snackbar.severity} variant="filled">
          {p.snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductManagement;