import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent, 
  DialogActions,
  TextField, 
  Button,
  Box,
  MenuItem, 
  InputAdornment, 
  IconButton,
  FormControl, 
  InputLabel, 
  Select, 
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "../../validation/validationSchema";
import { createUser, updateUser } from "../../services/userService";

const UserFormDialog = ({ 
  open, 
  editing, 
  selectedId, 
  defaultValues, 
  onClose, 
  loadUsers, 
  showMessage, 
  tiposDocumento }) => {

  const [showPassword, setShowPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset, 
    formState: { errors }, 
  } = useForm({
        resolver: yupResolver(userSchema),
        defaultValues: defaultValues || {},
      });

  useEffect(() => {
    if (!open) return
    if (!editing) {
      reset({
        username: "",
        password: "",
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        tipoDocumento: "",
        documento: "",
        rolId: "",
        email: "",
        telefono: "",
      });
  } else if (defaultValues) {
    reset({
      ...defaultValues,
      rolId: defaultValues.rol?.id || "",
    });
  }
}, [editing, defaultValues, reset, open]);

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

            <TextField
              label="Primer Nombre"
              {...register("primerNombre")}
              error={!!errors.PrimerNombre}
              helperText={errors.PrimerNombre?.message}
            />
            <TextField
              label="Segundo Nombre"
              {...register("segundoNombre")}
              error={!!errors.SegundoNombre}
              helperText={errors.SegundoNombre?.message}
            />
            <TextField
              label="Primer Apellido"
              {...register("primerApellido")}
              error={!!errors.PrimerApellido}
              helperText={errors.PrimerApellido?.message}
            />
            <TextField
              label="Segundo Apellido"
              {...register("segundoApellido")}
              error={!!errors.SegundoApellido}
              helperText={errors.SegundoApellido?.message}
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

            <TextField
              label="Documento"
              {...register("documento")}
              disabled={editing}
              error={!!errors.documento}
              helperText={errors.documento?.message}
            />

          <TextField
            select
            label="Rol"
            {...register("rolId")}
            error={!!errors.rolId}
            helperText={errors.rolId?.message}
          >
            <MenuItem value={1}>Administrador</MenuItem>
            <MenuItem value={2}>Cajero</MenuItem>
          </TextField>

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

export default UserFormDialog;

