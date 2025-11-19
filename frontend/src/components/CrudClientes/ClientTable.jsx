import React from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Button, Chip
} from "@mui/material";
import { Edit, CheckCircle, Cancel } from "@mui/icons-material";

const ClientTable = ({ clients, onEdit, onDelete, onActivate, loading }) => (
  <TableContainer component={Paper}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Nombre</TableCell>
          <TableCell>Apellido</TableCell>
          <TableCell>Documento</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Teléfono</TableCell>
          <TableCell>Estado</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {clients.length > 0 ? (
          clients.map((c) => {

            const active = c.estado === 1 || c.estado === true;

            return (
              <TableRow key={c.idCliente}>
                <TableCell>{c.idCliente}</TableCell>
                <TableCell>{c.nombre}</TableCell>
                <TableCell>{c.apellido}</TableCell>
                <TableCell>{c.documento}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.telefono}</TableCell>
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

                {/* EDITAR */}
                <TableCell align="center">
                  <IconButton size="small" onClick={() => onEdit(c)}>
                    <Edit />
                  </IconButton>

                {/* ACTIVAR / DESACTIVAR */}

                  {active ? (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => onDelete(c.idCliente)}
                      sx={{ ml: 1 }}
                    >
                      Desactivar
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => onActivate(c.idCliente)}
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
            <TableCell colSpan={9} align="center">
              {loading ? "Cargando..." : "No hay clientes"}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default ClientTable;

