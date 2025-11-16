import React from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Button
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const UserTable = ({ users, onEdit, onDelete, onActivate, loading }) => (
  <TableContainer component={Paper}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Usuario</TableCell>
          <TableCell>Nombre</TableCell>
          <TableCell>Apellido</TableCell>
          <TableCell>Documento</TableCell>
          <TableCell>Rol</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Teléfono</TableCell>
          <TableCell align="center">Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.length > 0 ? (
          users.map((u) => (
            <TableRow key={u.idUsuario}>
              <TableCell>{u.idUsuario}</TableCell>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.nombre}</TableCell>
              <TableCell>{u.apellido}</TableCell>
              <TableCell>{u.documento}</TableCell>
              <TableCell>{u.rol.nombre}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.telefono}</TableCell>

              <TableCell align="center">
                <IconButton size="small" onClick={() => onEdit(u)}>
                  <Edit />
                </IconButton>

                {u.estado ? (
                  <Button variant="outlined" color="error" onClick={() => onDelete(u.idUsuario)}>
                    Desactivar
                  </Button>
                ) : (
                  <Button variant="outlined" color="primary" onClick={() => onActivate(u.idUsuario)}>
                    Activar
                  </Button>
                )}
              </TableCell>

            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={9} align="center">
              {loading ? "Cargando..." : "No hay usuarios"}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default UserTable;
