import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton, Button, Chip } from "@mui/material";
import { Edit, CheckCircle, Cancel } from "@mui/icons-material";

export default function ProductTable({
  products,
  page,
  setPage,
  pageSize,
  setPageSize,
  totalRows,
  onEdit,
  onDelete,
  onActivate,
  loading
}) {

  const formatIVA = (iva) => {
    if (!iva) return "—";
    const number = iva.replace("IVA_", "");
    return `${number} %`;
  };

  const columns = [
    { field: "idProducto", headerName: "ID", width: 90 },

    { field: "nombre", headerName: "Nombre", width: 180 },

    {
      field: "categoria",
      headerName: "Categoría",
      width: 180,
      renderCell: (params) => params.row?.categoria?.nombre || ""
    },

    { field: "codigoBarras", headerName: "Código", width: 150 },
    { field: "descripcion", headerName: "Descripción", width: 200 },
    { field: "costo", headerName: "Costo", width: 120 },
    { field: "precioventa", headerName: "Precio Venta", width: 150 },

    {
      field: "iva",
      headerName: "IVA",
      width: 120,
      renderCell: (params) => formatIVA(params.row?.iva)
    },

    { field: "precioSinIva", headerName: "Sin IVA", width: 150 },

    {
      field: "stockActual",
      headerName: "Stock",
      width: 150,
      renderCell: (params) => {
        const stock = params.row.stockActual;
        const min = params.row.stockMinimo;

        let color = "success";
        let label = stock;

        if (stock <= 0) {
          color = "error";
          label = `Sin stock (${stock})`;
        } else if (stock <= min) {
          color = "warning";
          label = `Bajo (${stock})`;
        }

        return <Chip label={label} color={color} size="small" />;
      }
    },

    {
      field: "estado",
      headerName: "Estado",
      width: 140,
      renderCell: (params) => {
        const active = params.value === true || params.value === 1;
        return (
          <Chip
            icon={active ? <CheckCircle /> : <Cancel />}
            label={active ? "ACTIVO" : "INACTIVO"}
            size="small"
            color={active ? "success" : "default"}
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
        const p = params.row;
        const active = p.estado === true || p.estado === 1;

        return (
          <Box>
            <IconButton size="small" onClick={() => onEdit(p)}>
              <Edit />
            </IconButton>

            {active ? (
              <Button
                size="small"
                color="error"
                onClick={() => onDelete(p.idProducto)}
              >
                Desactivar
              </Button>
            ) : (
              <Button
                size="small"
                color="primary"
                onClick={() => onActivate(p.idProducto)}
              >
                Activar
              </Button>
            )}
          </Box>
        );
      }
    }
  ];

  return (
    <Box sx={{ height: 550, width: "100%" }}>
      <DataGrid
        rows={products || []}
        columns={columns}
        getRowId={(row) => row.idProducto}

        paginationMode="server"
        rowCount={totalRows || 0}

        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
        }}

        loading={loading}
      />
    </Box>
  );
}
