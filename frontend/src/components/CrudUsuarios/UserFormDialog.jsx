import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, InputAdornment, IconButton, Select,
  MenuItem, InputLabel, FormControl, Box
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "../../validation/validationSchema";
import { createUser, updateUser } from "../../services/userService";

const UserFormDialog = ({ open, editing, selectedId, defaultValues, onClose, loadUsers }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [changePassword, setChangePassword] = React.useState(false); // 👈 NUEVO

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(userSchema),
    context: { isEditing: editing },
    defaultValues: defaultValues || {},
  });

  React.useEffect(() => {
    reset(defaultValues || {});
    setChangePassword(false); // resetea el estado cada vez que se abre el diálogo
  }, [defaultValues, reset]);

  const onTogglePassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data) => {
    try {
      // ⚙️ Evita enviar password vacío
      if (!data.password) delete data.password;

      if (editing) {
        await updateUser(selectedId, data);
      } else {
        await createUser(data);
      }

      alert(editing ? "Usuario actualizado con éxito" : "Usuario creado con éxito");
      onClose();
      loadUsers();
    } catch (error) {
      console.error("❌ Error al guardar usuario:", error);

      // 🔹 Validaciones (nombre, apellido, documento, etc.)
      if (error.type === "validation" && error.errors) {
        Object.entries(error.errors).forEach(([campo, mensaje]) => {
          setError(campo, { type: "server", message: mensaje });
        });
        return;
      }

      // 🔹 Duplicados (correo, username, documento)
      if (error.type === "duplicate" && error.errors) {
        Object.entries(error.errors).forEach(([campo, mensaje]) => {
          setError(campo, { type: "server", message: mensaje });
        });
        return;
      }

      // 🔹 Otros errores
      alert(error.message || "⚠️ Error inesperado");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editing ? "Editar usuario" : "Registrar nuevo usuario"}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          id="user-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: "grid", gap: 2, mt: 1 }}
        >
          <TextField
            label="Usuario"
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          {/* 🔒 Campo de contraseña */}
          {!editing ? (
            // Crear usuario → contraseña obligatoria
            <TextField
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={onTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          ) : (
            // Editar usuario → opción de cambiar contraseña
            <>
              {!changePassword ? (
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={() => setChangePassword(true)}
                >
                  Cambiar contraseña
                </Button>
              ) : (
                <TextField
                  label="Nueva contraseña (opcional)"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={onTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </>
          )}

          {/* 🔹 Resto de campos */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Nombre"
              {...register("nombre")}
              error={!!errors.nombre}
              helperText={errors.nombre?.message}
            />
            <TextField
              label="Apellido"
              {...register("apellido")}
              error={!!errors.apellido}
              helperText={errors.apellido?.message}
            />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Documento"
              {...register("documento")}
              error={!!errors.documento}
              helperText={errors.documento?.message}
            />
            <FormControl error={!!errors.role}>
              <InputLabel id="role-label">Rol</InputLabel>
              <Select
                labelId="role-label"
                label="Rol"
                defaultValue=""
                {...register("role")}
              >
                <MenuItem value="ADMINISTRADOR">Administrador</MenuItem>
                <MenuItem value="CAJERO">Cajero</MenuItem>
              </Select>
              {errors.role && (
                <p style={{ color: "red", fontSize: "0.8rem", marginTop: 4 }}>
                  {errors.role.message}
                </p>
              )}
            </FormControl>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
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
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          type="submit"
          form="user-form"
          variant="contained"
          disabled={isSubmitting}
        >
          {editing ? "Guardar" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormDialog;
