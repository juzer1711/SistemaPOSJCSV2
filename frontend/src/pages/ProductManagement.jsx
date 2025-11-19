import React, { useEffect, useState } from "react";
import { getActiveProducts, getInactiveProducts, deactivateProduct, activateProduct } from "../services/productService";
import ProductTable from "../components/CrudProductos/ProductTable";
import ProductFormDialog from "../components/CrudProductos/ProductFormDialog";
import ProductSearchBar from "../components/CrudProductos/ProductSearchBar";
import { Box, Toolbar, Typography } from "@mui/material";
import ConfirmDialog from "../components/ConfirmDialog"; 
import { Snackbar, Alert } from "@mui/material";

const ProductManagement = () => {
  const [products, setProducts] = useState([]); // Lista de productos
  const [filter, setFilter] = useState(""); // Texto del buscador
  const [open, setOpen] = useState(false); // Control del modal
  const [editing, setEditing] = useState(false); // Modo edición/crear
  const [selectedProduct, setSelectedProduct] = useState(null); // Producto seleccionado
  const [showInactive, setShowInactive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [snackbar, setSnackbar] = useState({open: false,message: "",severity: "success",});

  useEffect(() => {
    loadProducts();
  }, [showInactive]);

  // Cargar productos del backend
  const loadProducts = async () => {
    const res = showInactive
        ? await getInactiveProducts()
        : await getActiveProducts();
    setProducts(res.data);
  };

  // Abrir formulario modo "Crear"
  const handleAdd = () => {
    setEditing(false);
    setSelectedProduct(null);
    setOpen(true);
  };

  // Abrir formulario modo "Editar"
  const handleEdit = (product) => {
    setEditing(true);
    setSelectedProduct(product);
    setOpen(true);
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

  // Filtro de búsqueda
  const filtered = products.filter((p) =>
    `${p.nombre} ${p.codigo} ${p.idProducto} ${p.categoria} ${p.descripcion}`
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">Gestión de Productos</Typography>
      </Toolbar>

      <ProductSearchBar filter={filter} 
      onFilterChange={setFilter} 
      onAdd={handleAdd} 
      showInactive={showInactive} 
      onToggleInactive={() => setShowInactive(prev => !prev)} />

      <ProductTable
        products={filtered}
        onEdit={handleEdit}
        onDelete={handleInactive}
        onActivate={handleActivate}
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
