import React, { useEffect, useState } from "react";
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

const ProductFormDialog = ({ open, editing, selectedId, defaultValues, onClose, loadProducts, showMessage }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: defaultValues || {},
  });

useEffect(() => {
  if (!editing) {
    reset({
      nombre: "",
      categoria: "",
      costo: "",
      precioVenta: "",
    });
  }else {
      reset(defaultValues || {});
    }
}, [defaultValues, editing, reset]);


  const onSubmit = async (data) => {
    try {
      if (editing) {
        await updateProduct(selectedId, data);
        showMessage("Producto actualizado con éxito", "success");
      } else {
        await createProduct(data);
        showMessage("Producto creado con éxito", "success");
      }
      reset({});
      onClose();
      loadProducts();

    } catch (error) {
  showMessage(error.message, "error");
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

            <DialogActions>
              <Button onClick={onClose}>Cancelar</Button>
              <Button
                type="submit"
                variant="contained"
              >
                {editing ? "Guardar" : "Crear"}
              </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
