import React, { useEffect, useState } from "react";
import { getProducts, desactivarProducto, activarProducto } from "../services/productService";
import ProductTable from "../components/CrudProductos/ProductTable";
import ProductFormDialog from "../components/CrudProductos/ProductFormDialog";
import ProductSearchBar from "../components/CrudProductos/ProductSearchBar";
import { Box, Toolbar, Typography } from "@mui/material";

export default function ProductManagement() {
  const [products, setProducts] = useState([]); // Lista de productos
  const [filter, setFilter] = useState(""); // Texto del buscador
  const [open, setOpen] = useState(false); // Control del modal
  const [editing, setEditing] = useState(false); // Modo edición/crear
  const [selectedProduct, setSelectedProduct] = useState(null); // Producto seleccionado

  useEffect(() => {
    loadProducts();
  }, []);

  // Cargar productos del backend
  const loadProducts = async () => {
    const res = await getProducts();
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

// Activar o desactivar producto
const handleToggleStatus = async (producto) => {
  const accion =
    producto.estado === "ACTIVO" ? "desactivar" : "activar";

  if (window.confirm(`¿Deseas ${accion} este producto?`)) {
    try {
      if (producto.estado === "ACTIVO") {
        await desactivarProducto(producto.idProducto);
      } else {
        await activarProducto(producto.idProducto);
      }

      loadProducts(); // recargar la tabla
    } catch (error) {
      console.error("Error al cambiar estado del producto", error);
    }
  }
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

      <ProductSearchBar filter={filter} onFilterChange={setFilter} onAdd={handleAdd} />

      <ProductTable
        products={filtered}
        onEdit={handleEdit}
        onToggleState={handleToggleStatus}
      />

      <ProductFormDialog
        open={open}
        editing={editing}
        selectedId={selectedProduct?.idProducto}
        defaultValues={selectedProduct}
        onClose={() => setOpen(false)}
        loadProducts={loadProducts}
      />
    </Box>
  );
}
