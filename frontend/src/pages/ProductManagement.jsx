import React, { useEffect, useState, useMemo } from "react";
import { 
  getActiveProducts, 
  getInactiveProducts, 
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
  const [filter, setFilter] = useState(""); // Texto del buscador
  const [open, setOpen] = useState(false); // Control del modal
  const [openCategoria, setOpenCategoria] = useState(false); // Control del modal
  const [editing, setEditing] = useState(false); // Modo edición
  const [editingCategoria, setEditingCategoria] = useState(false); // Modo edición/crear
  const [selectedProduct, setSelectedProduct] = useState(null); // Producto seleccionado
  const [selectedCategoria, setSelectedCategoria] = useState(null); // Producto seleccionado
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
  }, [showInactive]);

  useEffect(() => {
    loadCategorias();
  }, []);

  // Cargar productos del backend
  const loadProducts = async () => {
    const res = showInactive
        ? await getInactiveProducts()
        : await getActiveProducts();
    setProducts(res.data);
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

const filteredSortedProducts = useMemo(() => {
  const q = filter?.trim().toLowerCase();

  // 1) Aplicar showInactive toggle (ya lo cargas por efecto, así que aquí solo filtramos por estado si advancedFilters lo solicita)
  let result = [...products];

  // 2) Aplicar filtros avanzados
  if (advancedFilters.categoria) {
    result = result.filter(
      p => p.categoria.id === Number(advancedFilters.categoria)
    );
  }
  if (advancedFilters.estado) {
    const wantActive = advancedFilters.estado === "activo";
    result = result.filter(p => !!p.estado === wantActive);
  }

  // 3) Búsqueda en campos específicos (si q está)
  if (q) {
    result = result.filter((p) => {
      const fields = [
        p.nombre,
        p.categoria.nombre,
        p.codigoBarras,
        p.descripcion,
        p.idProducto?.toString(),
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
}, [products,categorias, filter, advancedFilters, sortBy]);

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
        products={filteredSortedProducts}
        onEdit={handleEdit}
        onDelete={handleInactive}
        onActivate={handleActivate}
        visibleColumns={visibleColumns}
        loading={false}
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
