import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Box, TextField, InputAdornment } from "@mui/material";
import { Edit, Delete, Add, Search } from "@mui/icons-material";

const ClientTable = ({ clients, onEdit, onDelete, onActivate, loading, onSearch, searchTerm, onClear }) => (
  <>
    {/* Barra de búsqueda y botones */}
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
      {/* Barra de búsqueda */}
      <TextField
        size="small"
        placeholder="Buscar cliente..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
      {/* Botones */}
      <Box>
        <Button variant="contained" color="primary" startIcon={<Add />} sx={{ mr: 1 }}>
          Agregar
        </Button>
        <Button variant="outlined" onClick={onClear}>
          Limpiar
        </Button>
      </Box>
    </Box>

    {/* Tabla de Clientes */}
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Documento</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.length > 0 ? (
            clients.map((c) => (
              <TableRow key={c.idCliente}>
                <TableCell>{c.idCliente}</TableCell>
                <TableCell>{c.nombre}</TableCell>
                <TableCell>{c.documento}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.telefono}</TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => onEdit(c)}>
                    <Edit />
                  </IconButton>
                  {c.estado ? (
                    <Button variant="outlined" color="error" onClick={() => onDelete(c.idCliente)}>
                      Desactivar
                    </Button>
                  ) : (
                    <Button variant="outlined" color="primary" onClick={() => onActivate(c.idCliente)}>
                      Activar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                {loading ? "Cargando..." : "No hay clientes"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </>
);

export default ClientTable;
