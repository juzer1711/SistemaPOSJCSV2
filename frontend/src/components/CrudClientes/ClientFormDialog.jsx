import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button, Box, DialogActions } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { clientSchema } from "../../validation/validationSchema";  // Definimos validaciones específicas para clientes
import { createClient, updateClient } from "../../services/clientService"; // Ajusta la ruta si es necesario

const ClientFormDialog = ({ open, editing, selectedId, defaultValues, onClose, loadClients, showMessage }) => {
  const { 
    register,
    handleSubmit, 
    reset, formState: { errors } } = useForm({
    resolver: yupResolver(clientSchema),
    defaultValues: defaultValues || {},
  });

useEffect(() => {
    if (!editing) {
      reset({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        documento: ""
      });
    } else {
      reset(defaultValues || {});
    }
  }, [editing, defaultValues, reset]);


  const onSubmit = async (data) => {
    try {
      if (editing) {
        await updateClient(selectedId, data);
        showMessage("Cliente actualizado con éxito", "success");
      } else {
        await createClient(data);
        showMessage("Cliente creado con éxito", "success");
      }
      reset({});
      onClose();
      loadClients();  // Recargar la lista de clientes
    } catch (error) {
  showMessage(error.message, "error");
}

  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editing ? "Editar Cliente" : "Registrar Cliente"}</DialogTitle>
      <DialogContent>
        <Box component="form" 
        onSubmit={handleSubmit(onSubmit)} 
        noValidate 
        sx={{ display: "grid", gap: 2, mt: 1}}
        >
          <TextField 
          label="Nombre" 
          {...register("nombre")} 
          error={!!errors.nombre} 
          helperText={errors.nombre?.message} 
          />

          <TextField label="Apellido" 
          {...register("apellido")} 
          error={!!errors.apellido} 
          helperText={errors.apellido?.message}
          />

          {!editing ? (
            <TextField
                  label="Documento"
                  {...register("documento")}
                  error={!!errors.documento}
                  helperText={errors.documento?.message}/>) : (null)}

          <TextField label="Email" 
          {...register("email")} 
          error={!!errors.email} 
          helperText={errors.email?.message} 
          />

          <TextField 
          label="Teléfono" 
          {...register("telefono")} 
          error={!!errors.telefono} 
          helperText={errors.telefono?.message}
           />
          <DialogActions sx={{ px: 0 }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editing ? "Guardar" : "Crear"}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ClientFormDialog;
