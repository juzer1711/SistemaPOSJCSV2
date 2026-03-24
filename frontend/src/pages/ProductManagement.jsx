import React, { useEffect, useState, useMemo } from "react";
import { 
  searchProducts, 
  deactivateProduct, 
  activateProduct, 
  getCategorias
} from "../services/productService";
import ProductTable from "../components/CrudProductos/ProductTable";
import ProductFormDialog from "../components/CrudProductos/ProductFormDialog";
import ProductSearchBar from "../components/CrudProductos/ProductSearchBar";
import { Box, Toolbar, Typography } from "@mui/material";
import ConfirmDialog from "../components/ConfirmDialog"; 
import { Snackbar, Alert } from "@mui/material";
import CategoriaFormDialog from "../components/CrudProductos/CategoriaFormDialog";

const ProductManagement = () => {
  const [products, setProducts] = useState([]); // Lista de productos
  const [categorias, setCategorias] = useState([]); //Lista de categorias

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const [filter, setFilter] = useState(""); // Texto del buscador
  const [open, setOpen] = useState(false); // Control del modal
  const [openCategoria, setOpenCategoria] = useState(false); // Control del modal
  const [editing, setEditing] = useState(false); // Modo edición
  const [editingCategoria, setEditingCategoria] = useState(false); // Modo edición/crear
  const [selectedProduct, setSelectedProduct] = useState(null); // Producto seleccionado
  const [selectedCategoria, setSelectedCategoria] = useState(null); // Categoria seleccionado
  const [showInactive, setShowInactive] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({});
  const [selectedId, setSelectedId] = useState(null);

  const [snackbar, setSnackbar] = useState({open: false,message: "",severity: "success",});

const ALL_COLUMNS = {
  idProducto: "ID",
  nombre: "Nombre",
  categoria: "Categoria",
  codigoBarras: "Codigo de Barras",
  descripcion: "Descripción",
  costo: "Costo",
  precioventa: "Precio de Venta",
  iva: "IVA",
  precioSinIva: "Precio sin Iva",
  estado: "Estado",
  acciones: "Acciones",
};
const [visibleColumns, setVisibleColumns] = useState(() => {
  const defaults = {};
  Object.keys(ALL_COLUMNS).forEach((k) => (defaults[k] = true));
  return defaults;
});

const [sortBy, setSortBy] = useState({ key: "nombre", direction: "asc" }); // default
const [advancedFilters, setAdvancedFilters] = useState({
  categoria: "",
  estado: "", // "activo" | "inactivo" | ""
});

const handleShowAll = () => {
  const all = {};
  Object.keys(visibleColumns).forEach(k => all[k] = true);
  setVisibleColumns(all);
};

  useEffect(() => {
    loadProducts();
  }, [
    page,
    pageSize,
    sortBy,
    filter,
    advancedFilters,
    showInactive
  ]);

  useEffect(() => {
    loadCategorias();
  }, []);

  // Cargar productos del backend
  const loadProducts = async () => {
    try {
      const params = {
        page,
        size: pageSize,
        sort: `${sortBy.key},${sortBy.direction}`,

        search: filter || undefined,

        categoria: advancedFilters.categoria || undefined,

        estado: showInactive ? false : true
      };

      const res = await searchProducts(params);

      setProducts(res.data.content || []);
      setTotalRows(res.data.totalElements || 0);

    } catch (error) {
      console.error(error);
    }
  };

  // Cargar productos del backend
  const loadCategorias = async () => {
    const res = await getCategorias();
    setCategorias(res.data);
  };

  // Abrir formulario modo "Crear"
  const handleAdd = () => {
    setEditing(false);
    setSelectedProduct(null);
    setOpen(true);
  };

  const handleAddCategoria = () => {
    setEditingCategoria(false);
    setSelectedCategoria(null);
    setOpenCategoria(true);
  };

  // Abrir formulario modo "Editar"
  const handleEdit = (product) => {
    setEditing(true);
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleEditCategoria = (categoria) => {
    setEditingCategoria(true);
    setSelectedCategoria(categoria);
    setOpenCategoria(true);
  };


    const openDeactivateDialog = (id) => {
    setSelectedId(id);
    setDialogInfo({
      title: "¿Desactivar producto?",
      message: "Usted no podrá acceder a los datos del producto.",
      confirmText: "Desactivar",
      confirmColor: "error",
    });
    setDialogOpen(true);
  };

  
  const openActivateDialog = (id) => {
    setSelectedId(id);
    setDialogInfo({
      title: "¿Activar producto?",
      message: "Usted podrá acceder a los datos del producto nuevamente.",
      confirmText: "Activar",
      confirmColor: "primary",
    });
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    setDialogOpen(false);

    if (dialogInfo.confirmText === "Desactivar") {
      await deactivateProduct(selectedId);
      showMessage("Producto desactivado correctamente");
    } else {
      await activateProduct(selectedId);
      showMessage("Producto activado correctamente");
    }
    loadProducts();  
  };

  const handleInactive = (id) => {
    openDeactivateDialog(id);
  };

  const handleActivate = (id) => {
    openActivateDialog(id);
  };


    // Función que muestra los mensajes de éxito 
  const showMessage = (msg, type = "success") => {
    setSnackbar({ open: true, message: msg, severity: type });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">Gestión de Productos</Typography>
      </Toolbar>

      <ProductSearchBar 
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
      categorias={categorias}
      onEditCategoria={handleEditCategoria}
      onAddCategoria={handleAddCategoria}
      />

      <ProductTable
        products={products}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalRows={totalRows}
        loading={false}

        onEdit={handleEdit}
        onDelete={handleInactive}
        onActivate={handleActivate}
        visibleColumns={visibleColumns}
      />

      <ProductFormDialog
        open={open}
        editing={editing}
        selectedId={selectedProduct?.idProducto}
        defaultValues={selectedProduct}
        onClose={() => {
        setOpen(false);
        setEditing(false);
        setSelectedProduct(null);
      }}
        loadProducts={loadProducts}
        categorias={categorias}
        showMessage={showMessage}
      />
      <CategoriaFormDialog
        open={openCategoria}
        editing={editingCategoria}
        selectedId={selectedCategoria?.idCategoria}
        defaultValues={selectedCategoria}
        onClose={() => {
        setOpenCategoria(false);
        setEditingCategoria(false);
        setSelectedCategoria(null);
      }}
        loadProducts={loadProducts}
        loadCategorias={loadCategorias}
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
};

export default ProductManagement;
