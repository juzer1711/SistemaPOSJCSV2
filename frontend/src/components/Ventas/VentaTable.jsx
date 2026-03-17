import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip, Button, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function VentaTable({
  ventas,
  page,
  setPage,
  pageSize,
  setPageSize,
  totalRows,
  onView,
  onDeactivate,
  onActivate,
  visibleColumns,
  loading
}) {

  const columns = [
    { field: "idVenta", headerName: "ID", width: 90 },

    {
      field: "fecha",
      headerName: "Fecha",
      width: 180,
      renderCell: (params) => {
      const fecha = params.row.fecha;
      if (!fecha) return "-";

      const date = new Date(fecha);
      return isNaN(date) ? "-" : date.toLocaleString("es-CO");
    }
    },

    { field: "nombreCliente", headerName: "Cliente", width: 200 },

    { field: "documentoCliente", headerName: "Documento", width: 150 },

    { field: "idCaja", headerName: "Caja", width: 90 },

    { field: "nombreCajero", headerName: "Cajero", width: 160 },

    { field: "metodoPago", headerName: "Método Pago", width: 150 },

    {
      field: "total",
      headerName: "Total",
      width: 120,
      renderCell: (params) => {
      const total = params.row.total;
      return `$${Number(total || 0).toLocaleString("es-CO")}`;
    }
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 130,
      renderCell: (params) => {

        const active = params.value === true || params.value === 1;

        return (
          <Chip
            label={active ? "ACTIVO" : "INACTIVO"}
            color={active ? "success" : "default"}
            size="small"
          />
        );
      }
    },

    {
      field: "acciones",
      headerName: "Acciones",
      width: 180,
      sortable: false,
      renderCell: (params) => {

        const v = params.row;
        const active = v.estado === true || v.estado === 1;

        return (
          <>
            <IconButton onClick={() => onView(v.idVenta)}>
              <VisibilityIcon />
            </IconButton>

            {active ? (
              <Button
                size="small"
                color="error"
                onClick={() => onDeactivate(v.idVenta)}
              >
                Desactivar
              </Button>
            ) : (
              <Button
                size="small"
                onClick={() => onActivate(v.idVenta)}
              >
                Activar
              </Button>
            )}
          </>
        );
      }
    }
  ];

  return (
    <Box sx={{ height: 550, width: "100%" }}>
      <DataGrid
        rows={ventas || []}
        columns={columns}
        getRowId={(row) => row.idVenta}

        paginationMode="server"
        sortingMode="server"

        rowCount={totalRows || 0}

        paginationModel={{ page, pageSize }}

        onPaginationModelChange={(model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
        }}

        onSortModelChange={(model) => {
          if (model.length > 0) {
            setSortBy({
              key: model[0].field,
              direction: model[0].sort
            });
          }
        }}

        loading={loading}
      />
    </Box>
  );
}

