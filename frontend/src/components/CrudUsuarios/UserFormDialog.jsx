import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, MenuItem, InputAdornment,
  IconButton, Typography, Chip, CircularProgress, Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "../../validation/validationSchema";
import { createUser, updateUser } from "../../services/userService";
import { styles } from "../../styles/users/stylesUserFormDialog";

const TIPOS_DOCUMENTO = [
  { value: "CEDULA_CIUDADANIA",   label: "Cédula de Ciudadanía" },
  { value: "CEDULA_EXTRANJERIA",  label: "Cédula de Extranjería" },
  { value: "TARJETA_EXTRANJERIA", label: "Tarjeta de Extranjería" },
  { value: "PASAPORTE",           label: "Pasaporte" },
  { value: "PEP",                 label: "Permiso Especial de Permanencia" },
];

const UserFormDialog = ({
  open, editing, selectedId, defaultValues,
  onClose, loadUsers, showMessage,
}) => {
  const theme = useTheme();
  const [showPassword, setShowPassword]   = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [isSubmitting, setIsSubmitting]   = useState(false); // ✅ estado de carga

  const {
    register, handleSubmit, reset, setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
    context: { isEditing: editing }, // ✅ contexto para el schema condicional de password
    defaultValues: defaultValues || {},
  });

  // ── Reset al abrir/cerrar ────────────────────────────────────────
  useEffect(() => {
    if (!open) {
      setChangePassword(false);
      setShowPassword(false);
      return;
    }
    if (!editing) {
      reset({
        username: "", password: "", primerNombre: "", segundoNombre: "",
        primerApellido: "", segundoApellido: "", tipoDocumento: "",
        documento: "", rolId: "", email: "", telefono: "",
      });
    } else if (defaultValues) {
      reset({ ...defaultValues, rolId: defaultValues.rol?.id || "" });
    }
  }, [editing, defaultValues, reset, open]);

  // ── Submit ───────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      data.rol = { id: data.rolId };
      delete data.rolId;
      if (!data.password) delete data.password;

      if (editing) {
        await updateUser(selectedId, data);
        showMessage("Usuario actualizado exitosamente", "success");
      } else {
        await createUser(data);
        showMessage("Usuario creado exitosamente", "success");
      }
      reset();
      onClose();
      loadUsers();
    } catch (error) {
      const resData = error.response?.data;
      if (resData?.field) {
        setError(resData.field, { type: "manual", message: resData.message });
      } else {
        // ✅ showMessage en vez de alert()
        showMessage(resData?.message || "Error al guardar el usuario", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Helper: campo de contraseña reutilizable ─────────────────────
  const PasswordField = ({ label }) => (
    <TextField
      label={label}
      type={showPassword ? "text" : "password"}
      fullWidth
      {...register("password")}
      error={!!errors.password}
      helperText={errors.password?.message}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShowPassword((p) => !p)} edge="end"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={styles.dialog}>

      {/* ── Header ── */}
      <DialogTitle component="div" sx={styles.dialogHeader}>
        <Typography variant="h6" fontWeight={700}>
          {editing ? "Editar Usuario" : "Registrar Usuario"}
        </Typography>
        <Chip
          label={editing ? "Editando" : "Nuevo"}
          size="small"
          color={editing ? "warning" : "primary"}
          variant="outlined"
        />
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5, pb: 0 }}>
        <Box
          component="form"
          id="user-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >

          {/* ── Sección 1: Cuenta de acceso ── */}
          <Typography sx={styles.sectionLabel(theme)}>
            Cuenta de acceso
          </Typography>

          <Box sx={styles.grid2}>
            <TextField
              label="Usuario *"
              fullWidth
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message || " "}
            />
            <TextField
              select
              label="Rol *"
              fullWidth
              {...register("rolId")}
              error={!!errors.rolId}
              helperText={errors.rolId?.message || " "}
              // ✅ fix: value controlado para que no quede vacío sin seleccionar
              defaultValue=""
            >
              <MenuItem value={1}>Administrador</MenuItem>
              <MenuItem value={2}>Cajero</MenuItem>
            </TextField>
          </Box>

          {/* Contraseña — condicional crear/editar */}
          {!editing ? (
            <PasswordField label="Contraseña *" />
          ) : (
            !changePassword ? (
              <Button
                variant="outlined"
                fullWidth
                sx={styles.changePasswordBtn}
                onClick={() => setChangePassword(true)}
              >
                Cambiar contraseña
              </Button>
            ) : (
              <PasswordField label="Nueva contraseña" />
            )
          )}

          {/* ── Sección 2: Datos personales ── */}
          <Typography sx={{ ...styles.sectionLabel(theme), mt: 2.5 }}>
            Datos personales
          </Typography>

          <Box sx={styles.grid2}>
            <TextField
              label="Primer nombre *"
              fullWidth
              {...register("primerNombre")}
              error={!!errors.primerNombre}          // ✅ bug fix: camelCase correcto
              helperText={errors.primerNombre?.message || " "}
            />
            <TextField
              label="Segundo nombre"
              fullWidth
              {...register("segundoNombre")}
              error={!!errors.segundoNombre}         // ✅ bug fix
              helperText={errors.segundoNombre?.message || " "}
            />
            <TextField
              label="Primer apellido *"
              fullWidth
              {...register("primerApellido")}
              error={!!errors.primerApellido}        // ✅ bug fix
              helperText={errors.primerApellido?.message || " "}
            />
            <TextField
              label="Segundo apellido"
              fullWidth
              {...register("segundoApellido")}
              error={!!errors.segundoApellido}       // ✅ bug fix
              helperText={errors.segundoApellido?.message || " "}
            />
          </Box>

          <Box sx={styles.grid2}>
            <TextField
              select
              label="Tipo de documento *"
              fullWidth
              defaultValue=""
              {...register("tipoDocumento")}
              error={!!errors.tipoDocumento}
              helperText={errors.tipoDocumento?.message || " "}
            >
              {TIPOS_DOCUMENTO.map(({ value, label }) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Número de documento *"
              fullWidth
              disabled={editing}
              {...register("documento")}
              error={!!errors.documento}
              helperText={
                editing
                  ? "No se puede modificar"
                  : errors.documento?.message || " "
              }
            />
          </Box>

          {/* ── Sección 3: Contacto ── */}
          <Typography sx={{ ...styles.sectionLabel(theme), mt: 1 }}>
            Contacto
          </Typography>

          <Box sx={styles.grid2}>
            <TextField
              label="Email *"
              fullWidth
              type="email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message || " "}
            />
            <TextField
              label="Teléfono *"
              fullWidth
              {...register("telefono")}
              error={!!errors.telefono}
              helperText={errors.telefono?.message || " "}
            />
          </Box>

        </Box>
      </DialogContent>

      {/* ── Acciones — fuera del DialogContent ── */}
      <DialogActions sx={styles.dialogActions}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form="user-form"
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {isSubmitting
            ? (editing ? "Guardando..." : "Creando...")
            : (editing ? "Guardar cambios" : "Crear usuario")
          }
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default UserFormDialog;