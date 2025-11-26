import React from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Button, Chip
} from "@mui/material";
import { Edit, CheckCircle, Cancel } from "@mui/icons-material";

const UserTable = ({ users, onEdit, onDelete, onActivate, loading, visibleColumns }) => {
  const visibleCount = Object.values(visibleColumns || {}).filter(Boolean).length || 1;
  return (
  <TableContainer component={Paper} sx={{ maxHeight: 500, overflowX: "auto" }}>
    <Table sx={{ minWidth: 1200 }} size="small">
      <TableHead>
        <TableRow>
          {visibleColumns.idUsuario && <TableCell>ID</TableCell>}
          {visibleColumns.username && <TableCell>Username</TableCell>}
          {visibleColumns.primerNombre && <TableCell>Primer Nombre</TableCell>}
          {visibleColumns.segundoNombre && <TableCell>Segundo Nombre</TableCell>}
          {visibleColumns.primerApellido && <TableCell>Primer Apellido</TableCell>}
          {visibleColumns.segundoApellido && <TableCell>Segundo Apellido</TableCell>}
          {visibleColumns.tipoDocumento && <TableCell>Tipo Documento</TableCell>}
          {visibleColumns.documento && <TableCell>Documento</TableCell>}
          {visibleColumns.rol && <TableCell>Rol</TableCell>}
          {visibleColumns.email && <TableCell>Email</TableCell>}
          {visibleColumns.telefono && <TableCell>Teléfono</TableCell>}
          {visibleColumns.estado && <TableCell>Estado</TableCell>}
          {visibleColumns.acciones && <TableCell align="center">Acciones</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {users.length > 0 ? (
          users.map((u) => {
            const active = u.estado === 1 || u.estado === true;
            return (
            <TableRow key={u.idUsuario}>
              {visibleColumns.idUsuario &&<TableCell>{u.idUsuario}</TableCell>}
              {visibleColumns.username &&<TableCell>{u.username}</TableCell>}
              {visibleColumns.primerNombre &&<TableCell>{u.primerNombre}</TableCell>}
              {visibleColumns.segundoNombre &&<TableCell>{u.segundoNombre}</TableCell>}
              {visibleColumns.primerApellido &&<TableCell>{u.primerApellido}</TableCell>}
              {visibleColumns.segundoApellido &&<TableCell>{u.segundoApellido}</TableCell>}
              {visibleColumns.tipoDocumento &&<TableCell>{u.tipoDocumento}</TableCell>}
              {visibleColumns.documento &&<TableCell>{u.documento}</TableCell>}
              {visibleColumns.rol &&<TableCell>{u.rol.nombre}</TableCell>}
              {visibleColumns.email &&<TableCell>{u.email}</TableCell>}
              {visibleColumns.telefono &&<TableCell>{u.telefono}</TableCell>}
              {visibleColumns.estado &&(
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
              )}
              {visibleColumns.acciones && (
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
              )}
            </TableRow>
          );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={visibleCount} align="center">
              {loading ? "Cargando..." : "No hay usuarios"}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);
};
export default UserTable;
