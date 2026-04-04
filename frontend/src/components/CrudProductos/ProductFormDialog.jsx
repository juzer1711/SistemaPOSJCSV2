import React, { useEffect } from "react";
import {
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField, 
  Button, 
  Box,
  Autocomplete ,
  MenuItem,
} from "@mui/material";
import { useForm, Controller} from "react-hook-form";
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
  reset,
  setError,
  formState: { errors } 
} = useForm({
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
      precioventa: "",
      iva: "",
    });
  }else if (defaultValues) {
      reset({
        ...defaultValues,
      categoriaId: Number(defaultValues.categoria?.id || ""),
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
        const data = error.response?.data;

        console.log(" DATA:", data);

        if (data?.field) {
          setError(data.field, {
            type: "manual",
            message: data.message
          });
        } else {
          showMessage(data?.message || "Error al guardar", "error");
        }
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
                isOptionEqualToValue={(option, value) => option.idCategoria === value.idCategoria}
                value={categorias.find((c) => Number(c.idCategoria) === Number(field.value)) || null}
                onChange={(e, newValue) => {
                  field.onChange(newValue ? Number(newValue.idCategoria) : null);
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
              {...register("precioventa")}
              error={!!errors.precioventa}
              helperText={errors.precioventa?.message}
          />

          <TextField
            select
            label="IVA"
            {...register("iva")}
            error={!!errors.iva}
            helperText={errors.iva?.message}
          >
            <MenuItem value="IVA_0">0%</MenuItem>
            <MenuItem value="IVA_5">5%</MenuItem>
            <MenuItem value="IVA_19">19%</MenuItem>
          </TextField>


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
