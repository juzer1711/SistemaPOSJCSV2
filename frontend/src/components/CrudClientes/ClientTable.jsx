import React from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Button, Chip
} from "@mui/material";
import { Edit, CheckCircle, Cancel } from "@mui/icons-material";

const ClientTable = ({ clients, onEdit, onDelete, onActivate, loading, visibleColumns }) => {
  // contar columnas visibles para colspan cuando no hay datos
  const visibleCount = Object.values(visibleColumns || {}).filter(Boolean).length || 1;

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 500, overflowX: "auto" }}>
      <Table sx={{ minWidth: 1200 }} size="small">
        <TableHead>
          <TableRow>
            {visibleColumns.idCliente && <TableCell>ID</TableCell>}
            {visibleColumns.tipoCliente && <TableCell>Tipo Cliente</TableCell>}
            {visibleColumns.primerNombre && <TableCell>Primer Nombre</TableCell>}
            {visibleColumns.segundoNombre && <TableCell>Segundo Nombre</TableCell>}
            {visibleColumns.primerApellido && <TableCell>Primer Apellido</TableCell>}
            {visibleColumns.segundoApellido && <TableCell>Segundo Apellido</TableCell>}
            {visibleColumns.razonSocial && <TableCell>Razón Social</TableCell>}
            {visibleColumns.tipoDocumento && <TableCell>Tipo Documento</TableCell>}
            {visibleColumns.documento && <TableCell>Documento</TableCell>}
            {visibleColumns.identificadorNit && <TableCell>DV</TableCell>}
            {visibleColumns.direccion && <TableCell>Direccion</TableCell>}
            {visibleColumns.email && <TableCell>Email</TableCell>}
            {visibleColumns.telefono && <TableCell>Teléfono</TableCell>}
            {visibleColumns.estado && <TableCell>Estado</TableCell>}
            {visibleColumns.acciones && <TableCell align="center">Acciones</TableCell>}
          </TableRow>
        </TableHead>

        <TableBody>
          {clients.length > 0 ? (
            clients.map((c) => {
              const active = c.estado === true;
              return (
                <TableRow key={c.idCliente}>
                  {visibleColumns.idCliente && <TableCell>{c.idCliente}</TableCell>}
                  {visibleColumns.tipoCliente && <TableCell>{c.tipoCliente}</TableCell>}
                  {visibleColumns.primerNombre && <TableCell>{c.primerNombre || "-"}</TableCell>}
                  {visibleColumns.segundoNombre && <TableCell>{c.segundoNombre || "-"}</TableCell>}
                  {visibleColumns.primerApellido && <TableCell>{c.primerApellido || "-"}</TableCell>}
                  {visibleColumns.segundoApellido && <TableCell>{c.segundoApellido || "-"}</TableCell>}
                  {visibleColumns.razonSocial && <TableCell>{c.razonSocial || "-"}</TableCell>}
                  {visibleColumns.tipoDocumento && <TableCell>{c.tipoDocumento}</TableCell>}
                  {visibleColumns.documento && <TableCell>{c.documento}</TableCell>}
                  {visibleColumns.identificadorNit && <TableCell>{c.identificadorNit || "-"}</TableCell>}
                  {visibleColumns.direccion && <TableCell>{c.direccion}</TableCell>}
                  {visibleColumns.email && <TableCell>{c.email}</TableCell>}
                  {visibleColumns.telefono && <TableCell>{c.telefono}</TableCell>}
                  {visibleColumns.estado && (
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
                      <IconButton size="small" onClick={() => onEdit(c)}>
                        <Edit />
                      </IconButton>

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
                  )}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={visibleCount} align="center">
                {loading ? "Cargando..." : "No hay clientes"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClientTable;
