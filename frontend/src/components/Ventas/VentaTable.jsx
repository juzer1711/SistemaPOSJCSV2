import React from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Chip, Button, TableFooter
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { CheckCircle, Cancel } from "@mui/icons-material";

const VentaTable = ({ ventas, onDeactivate, onActivate, onView, loading, visibleColumns }) => {
  const visibleCount = Object.values(visibleColumns || {}).filter(Boolean).length || 1;
  // Cálculo del total de ventas
  const totalVentas = ventas.reduce((acc, venta) => acc + (venta.total || 0), 0);

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 500, overflowX: "auto" }}>
      <Table sx={{ minWidth: 1200 }} size="small">
        <TableHead>
          <TableRow>
            {visibleColumns.idVenta && <TableCell>ID</TableCell>}
            {visibleColumns.fecha && <TableCell>Fecha</TableCell>}
            {visibleColumns.nombreCliente && <TableCell>Cliente</TableCell>}
            {visibleColumns.documentoCliente && <TableCell>Documento</TableCell>}
            {visibleColumns.metodoPago && <TableCell>Método de Pago</TableCell>}
            {visibleColumns.total && <TableCell>Total</TableCell>}
            {visibleColumns.estado && <TableCell>Estado</TableCell>}
            {visibleColumns.acciones && <TableCell align="center">Acciones</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {ventas.length > 0 ? (
            ventas.map((v) => {
              const active = v.estado === 1 || v.estado === true;
              return (
                <TableRow key={v.idVenta}>
                  {visibleColumns.idVenta && <TableCell>{v.idVenta}</TableCell>}
                  {visibleColumns.fecha && <TableCell>{new Date(v.fecha).toLocaleString()}</TableCell>}
                  {visibleColumns.nombreCliente && <TableCell>{v.nombreCliente}</TableCell>}
                  {visibleColumns.documentoCliente && <TableCell>{v.documentoCliente || "-"}</TableCell>}
                  {visibleColumns.metodoPago && <TableCell>{v.metodoPago}</TableCell>}
                  {visibleColumns.total && <TableCell>${v.total.toFixed(2)}</TableCell>}
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
                      <IconButton size="small" color="primary" onClick={() => onView?.(v.idVenta)}>
                        <VisibilityIcon />
                      </IconButton>

                      {active ? (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => onDeactivate(v.idVenta)}
                          sx={{ ml: 1 }}
                        >
                          Desactivar
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => onActivate(v.idVenta)}
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
                {loading ? "Cargando..." : "No hay ventas"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
                {/* Fila de total */}
        <TableFooter>
          <TableRow>
            <TableCell colSpan={visibleCount - 1} align="right"><strong>Total:</strong></TableCell>
            <TableCell colSpan={2} align="center">
              <strong>${totalVentas.toFixed(2)}</strong>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default VentaTable;

