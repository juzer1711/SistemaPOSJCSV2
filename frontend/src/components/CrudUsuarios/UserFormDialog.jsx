import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, InputAdornment, IconButton,
  FormControl, InputLabel, Select, MenuItem, Box
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "../../validation/validationSchema";
import { createUser, updateUser } from "../../services/userService";

const UserFormDialog = ({ open, editing, selectedId, defaultValues, onClose, loadUsers, showMessage }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [roles, setRoles] = useState([]);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(userSchema),
    context: { isEditing: editing },
    defaultValues: defaultValues || {},
  });

  // Cargar roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/roles", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setRoles(data);
      } catch (e) {
        console.error("Error cargando roles:", e);
      }
    };
    fetchRoles();
  }, []);

  // Resetear valores cuando se abre o cambia defaultValues
  useEffect(() => {
    reset(defaultValues || {});
    if (defaultValues?.rol) {
      setValue("rolId", defaultValues.rol.id);
    }
    setChangePassword(false);
  }, [defaultValues, reset, setValue]);

  const onSubmit = async (data) => {

    try {
      if (!data.rolId) {
        return alert("Debe seleccionar un rol.");
      }

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
      reset({});
      onClose();
      loadUsers();
    } catch (error) {
      showMessage(error.message, "error");
    }

  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editing ? "Editar Usuario" : "Registrar Usuario"}</DialogTitle>

      <DialogContent>
        {/* 🚀 AHORA EL FORMulario engloba también LOS BOTONES */}
        <Box
          component="form"
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

          {/* Contraseña */}
          {!editing ? (
            <TextField
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          ) : (
            <>
              {!changePassword ? (
                <Button variant="outlined" onClick={() => setChangePassword(true)}>
                  Cambiar contraseña
                </Button>
              ) : (
                <TextField
                  label="Nueva contraseña"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </>
          )}

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

            <FormControl fullWidth error={!!errors.rolId}>
              <InputLabel>Rol</InputLabel>
              <Select
                label="Rol"
                value={watch("rolId") || ""}
                onChange={(e) => setValue("rolId", e.target.value)}
              >
                {roles.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.nombre}
                  </MenuItem>
                ))}
              </Select>
              {errors.rolId && (
                <p style={{ color: "red", fontSize: "0.8rem" }}>{errors.rolId.message}</p>
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

          {/* 🔥 AHORA LOS BOTONES ESTÁN DENTRO DEL <form> */}
          <DialogActions sx={{ px: 0 }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {editing ? "Guardar" : "Crear"}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;

