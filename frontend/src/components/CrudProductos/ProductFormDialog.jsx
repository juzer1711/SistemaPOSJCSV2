import React, { useEffect, useState } from "react";
import {
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField, 
  Button, 
  Box,
  Autocomplete 
} from "@mui/material";
import { useForm,  Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSchema } from "../../validation/validationSchema"; 
import { createProduct, updateProduct } from "../../services/productService";

const ProductFormDialog = ({ 
  open, 
  editing, 
  selectedId,   
  defaultValues, 
  onClose, 
  loadProducts,
  categorias, 
  showMessage }) => {
  const { 
    register, 
    handleSubmit,
    control, 
    reset, formState: { errors } } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: defaultValues || {},
  });

useEffect(() => {
  if (!open) return
  if (!editing) {
    reset({
      nombre: "",
      categoriaId: "",
      codigoBarras: "",
      descripcion: "",
      costo: "",
      precio: "",
    });
  }else if (defaultValues) {
      reset({
        ...defaultValues,
      categoriaId: defaultValues.categoria?.id || "",
  });
    }
}, [defaultValues, editing, reset, open]);



  const onSubmit = async (data) => {
    try {
      if (!data.categoriaId) {
        return alert("Debe seleccionar una categoria.");
      }
      data.categoria = { id: data.categoriaId };
      delete data.categoriaId;

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
          <Controller
            name="categoriaId"
            control={control}
            rules={{ required: "La categoría es obligatoria" }}
            render={({ field }) => (
              <Autocomplete
                options={categorias}
                getOptionLabel={(option) => option.nombre}
                value={categorias.find((c) => c.id === field.value) || null}
                onChange={(e, newValue) => {
                  field.onChange(newValue ? newValue.id : "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Categoría"
                    error={!!errors.categoriaId}
                    helperText={errors.categoriaId?.message}
                  />
                )}
              />
            )}
          />

          <TextField
            label="Codigo de Barras"
            {...register("codigoBarras")}
            disabled={editing}
            error={!!errors.codigoBarras}
            helperText={errors.codigoBarras?.message}
          />
          <TextField
            label="Descripcion"
            {...register("descripcion")}
            error={!!errors.descripcion}
            helperText={errors.descripcion?.message}
          />
          <TextField
              label="Costo"
              {...register("costo")}
              error={!!errors.costo}
              helperText={errors.costo?.message}
          />
          <TextField
              label="Precio de venta"
              {...register("precio")}
              error={!!errors.precio}
              helperText={errors.precio?.message}
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
