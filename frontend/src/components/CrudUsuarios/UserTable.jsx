import React from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Button, Chip
} from "@mui/material";
import { Edit, CheckCircle, Cancel } from "@mui/icons-material";

const UserTable = ({ users, onEdit, onDelete, onActivate, loading }) => (
  <TableContainer component={Paper} sx={{ maxHeight: 500, overflowX: "auto" }}>
    <Table sx={{ minWidth: 1200 }} size="small">
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Usuario</TableCell>
          <TableCell>Primer Nombre</TableCell>
          <TableCell>Segundo Nombre</TableCell>
          <TableCell>Primer Apellido</TableCell>
          <TableCell>Segundo Apellido</TableCell>
          <TableCell>Tipo Documento</TableCell>
          <TableCell>Documento</TableCell>
          <TableCell>Rol</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Teléfono</TableCell>
          <TableCell>Estado</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.length > 0 ? (
          users.map((u) => {
            const active = u.estado === 1 || u.estado === true;
            return (
            <TableRow key={u.idUsuario}>
              <TableCell>{u.idUsuario}</TableCell>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.primerNombre}</TableCell>
              <TableCell>{u.segundoNombre}</TableCell>
              <TableCell>{u.primerApellido}</TableCell>
              <TableCell>{u.segundoApellido}</TableCell>
              <TableCell>{u.tipoDocumento}</TableCell>
              <TableCell>{u.documento}</TableCell>
              <TableCell>{u.rol.nombre}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.telefono}</TableCell>
              <TableCell>
                  <Chip
                    icon={active ? <CheckCircle /> : <Cancel />}
                    label={active ? "ACTIVO" : "INACTIVO"}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderRadius: "6px",
                      fontWeight: "bold",
                      animation: "fadeIn 0.3s ease-in-out",
                      bgcolor: active ? "rgba(46, 125, 50, 0.1)" : "rgba(158, 158, 158, 0.1)",
                      color: active ? "success.main" : "text.secondary",
                      borderColor: active ? "success.main" : "text.secondary",
                    }}
                  />
                </TableCell>

              <TableCell align="center">
                <IconButton size="small" onClick={() => onEdit(u)}>
                  <Edit />
                </IconButton>

                {active ? (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => onDelete(u.idUsuario)}
                      sx={{ ml: 1 }}
                    >
                      Desactivar
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => onActivate(u.idUsuario)}
                      sx={{ ml: 1 }}
                    >
                      Activar
                    </Button>
                  )}
              </TableCell>
            </TableRow>
          );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={12} align="center">
              {loading ? "Cargando..." : "No hay usuarios"}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default UserTable;
