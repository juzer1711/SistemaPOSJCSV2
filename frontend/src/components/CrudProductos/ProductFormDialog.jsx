import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box
} from "@mui/material";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { productSchema } from "../../validation/validationSchema"; 
import {
  createProduct,
  updateProduct
} from "../../services/productService";

const ProductFormDialog = ({ open, editing, selectedId, defaultValues, onClose, loadProducts }) => {

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: defaultValues || {},
  });

React.useEffect(() => {
  if (editing && defaultValues) {
    reset(defaultValues);
  } else {
    reset({
      nombre: "",
      categoria: "",
      costo: "",
      precioVenta: "",
      estado: "ACTIVO",
    });
  }
}, [defaultValues, editing, reset]);


  const onSubmit = async (data) => {
    try {
      if (editing) {
        await updateProduct(selectedId, data);
      } else {
        await createProduct(data);
      }

      alert(editing ? "Producto actualizado con éxito" : "Producto creado con éxito");

      onClose();
      loadProducts();

    } catch (error) {
      console.error("❌ Error al guardar producto:", error);

      // Errores de validación desde backend
      if (error.type === "validation" && error.errors) {
        Object.entries(error.errors).forEach(([campo, mensaje]) => {
          setError(campo, { type: "server", message: mensaje });
        });
        return;
      }

      // Errores de duplicado
      if (error.type === "duplicate" && error.errors) {
        Object.entries(error.errors).forEach(([campo, mensaje]) => {
          setError(campo, { type: "server", message: mensaje });
        });
        return;
      }

      // Otros errores
      alert(error.message || "⚠️ Error inesperado");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editing ? "Editar producto" : "Registrar nuevo producto"}
      </DialogTitle>

      <DialogContent>
        <Box
          component="form"
          id="product-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: "grid", gap: 2, mt: 1 }}
        >

          <TextField
            label="Nombre del producto"
            {...register("nombre")}
            error={!!errors.nombre}
            helperText={errors.nombre?.message}
          />

          <TextField
            label="Categoria"
            {...register("categoria")}
            error={!!errors.categoria}
            helperText={errors.categoria?.message}
          />

            <TextField
              label="Costo"
              {...register("costo")}
              error={!!errors.costo}
              helperText={errors.costo?.message}
            />

            <TextField
              label="Precio de venta"
              {...register("precioventa")}
              error={!!errors.precioventa}
              helperText={errors.precioventa?.message}
            />

            <TextField
              label="Estado"
              {...register("estado")}
              error={!!errors.estado}
              helperText={errors.estado?.message}
            />

        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          type="submit"
          form="product-form"
          variant="contained"
          disabled={isSubmitting}
        >
          {editing ? "Guardar" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductFormDialog;
