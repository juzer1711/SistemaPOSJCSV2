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
import FormSection from "../ui/FormSection";

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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "24px",
          overflow: "hidden",
        },
      }}
    >

      {/* ── Header ── */}
      <DialogTitle
        sx={{
          px: 4,
          pt: 3,
          pb: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "#FFFFFF",
        }}
      >

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              {editing ? "Editar Usuario" : "Nuevo Usuario"}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Completa la información del usuario
            </Typography>
          </Box>

          <Chip
            label={editing ? "Editando" : "Nuevo"}
            color={editing ? "warning" : "primary"}
            sx={{
              fontWeight: 600,
            }}
          />

        </Box>

      </DialogTitle>

      <DialogContent
        sx={{
          px: 4,
          py: 3,
          backgroundColor: "#FCFDFE",
        }}
      >
        <Box
          component="form"
          id="user-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >

          {/* ── Sección 1: Cuenta de acceso ── */}
          <FormSection title="Cuenta de acceso">

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
                defaultValue=""
              >
                <MenuItem value={1}>Administrador</MenuItem>
                <MenuItem value={2}>Cajero</MenuItem>
              </TextField>
            </Box>

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

          </FormSection>
          {/* ── Sección 2: Datos personales ── */}
          <FormSection title="Datos personales">

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
          </FormSection>        
          {/* ── Sección 3: Contacto ── */}
          <FormSection title="Contacto">

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
          </FormSection>
        </Box>
      </DialogContent>

      {/* ── Acciones — fuera del DialogContent ── */}
      <DialogActions
        sx={{
          px: 4,
          py: 2.5,
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "#FFFFFF",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="text"
          color="inherit"
          onClick={onClose}
          disabled={isSubmitting}
        >
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