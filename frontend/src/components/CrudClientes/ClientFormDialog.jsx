import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
} from "@mui/material";
import { useForm} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { clientSchema } from "../../validation/validationSchema";
import { createClient, updateClient } from "../../services/clientService";

const ClientFormDialog = ({
  open,
  editing,
  selectedId,
  defaultValues,
  onClose,
  loadClients,
  showMessage }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(clientSchema),
    defaultValues: defaultValues || {},
  });

  const tipoCliente = watch("tipoCliente");

  useEffect(() => {
    if (!open) return
    if (!editing) {
      reset({
        tipoCliente: "",
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        razonSocial: "",
        identificadorNit: "",
        documento: "",
        tipoDocumento: "",
        email: "",
        telefono: "",
        direccion: "",
      });
    } else {
      reset(defaultValues || {});
    }
  }, [editing, defaultValues, reset, open]);

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
      loadClients();
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editing ? "Editar Cliente" : "Registrar Cliente"}</DialogTitle>

      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: "grid", gap: 2, mt: 1 }}
        >
          {/* 🔥 Tipo Cliente */}
          <TextField
            select
            label="Tipo de Cliente"
            {...register("tipoCliente")}
            error={!!errors.tipoCliente}
            helperText={errors.tipoCliente?.message}
          >
            <MenuItem value="PERSONA_NATURAL">Persona Natural</MenuItem>
            <MenuItem value="EMPRESA">Empresa</MenuItem>
          </TextField>

          {/* ============================== */}
          {/*        PERSONA NATURAL         */}
          {/* ============================== */}
          {tipoCliente === "PERSONA_NATURAL" && (
            <>
              <TextField
                label="Primer Nombre"
                {...register("primerNombre")}
                error={!!errors.primerNombre}
                helperText={errors.primerNombre?.message}
              />

              <TextField
                label="Segundo Nombre"
                {...register("segundoNombre")}
                error={!!errors.segundoNombre}
                helperText={errors.segundoNombre?.message}
              />

              <TextField
                label="Primer Apellido"
                {...register("primerApellido")}
                error={!!errors.primerApellido}
                helperText={errors.primerApellido?.message}
              />

              <TextField
                label="Segundo Apellido"
                {...register("segundoApellido")}
                error={!!errors.segundoApellido}
                helperText={errors.segundoApellido?.message}
              />
              <TextField
                select
                label="Tipo de Documento"
                {...register("tipoDocumento")}
                error={!!errors.tipoDocumento}
                helperText={errors.tipoDocumento?.message}
              >
                <MenuItem value="CEDULA_CIUDADANIA">Cédula Ciudadanía</MenuItem>
                <MenuItem value="CEDULA_EXTRANJERIA">Cédula Extranjería</MenuItem>
                <MenuItem value="TARJETA_EXTRANJERIA">Tarjeta Extranjería</MenuItem>
                <MenuItem value="PASAPORTE">Pasaporte</MenuItem>
                <MenuItem value="PEP">Permiso Especial de Permanencia</MenuItem>
              </TextField>
            </>
          )}

          {/* ============================== */}
          {/*            EMPRESA             */}
          {/* ============================== */}
          {tipoCliente === "EMPRESA" && (
            <>
              <TextField
                label="Razón Social"
                {...register("razonSocial")}
                error={!!errors.razonSocial}
                helperText={errors.razonSocial?.message}
              />

              <TextField
                label="Dígito verificador NIT"
                {...register("identificadorNit")}
                error={!!errors.identificadorNit}
                helperText={errors.identificadorNit?.message}
              />

              <TextField
                select
                label="Tipo de Documento"
                {...register("tipoDocumento")}
                error={!!errors.tipoDocumento}
                helperText={errors.tipoDocumento?.message}
              >
                <MenuItem value="NIT">NIT</MenuItem>
              </TextField>
            </>
          )}

          {/* ============================== */}
          {/*       CAMPOS COMUNES           */}
          {/* ============================== */}

          <TextField
            label="Documento"
            {...register("documento")}
            disabled={editing}
            error={!!errors.documento}
            helperText={errors.documento?.message}
          />

          <TextField
            label="Email"
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

