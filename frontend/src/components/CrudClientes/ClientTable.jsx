import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton, Button, Chip } from "@mui/material";
import { Edit, CheckCircle, Cancel } from "@mui/icons-material";

export default function ClientTable({
  clients,
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

  const columns = [
    { field: "idCliente", headerName: "ID", width: 90 },

    { field: "tipoCliente", headerName: "Tipo Cliente", width: 150 },

    { field: "primerNombre", headerName: "Primer Nombre", width: 150 },
    { field: "segundoNombre", headerName: "Segundo Nombre", width: 150 },

    { field: "primerApellido", headerName: "Primer Apellido", width: 150 },
    { field: "segundoApellido", headerName: "Segundo Apellido", width: 150 },

    { field: "razonSocial", headerName: "Razón Social", width: 180 },

    { field: "tipoDocumento", headerName: "Tipo Documento", width: 180 },
    { field: "documento", headerName: "Documento", width: 150 },

    { field: "identificadorNit", headerName: "DV", width: 100 },

    { field: "direccion", headerName: "Dirección", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "telefono", headerName: "Teléfono", width: 150 },

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
        const c = params.row;
        const active = c.estado === true || c.estado === 1;

        return (
          <Box>
            <IconButton size="small" onClick={() => onEdit(c)}>
              <Edit />
            </IconButton>

            {active ? (
              <Button
                size="small"
                color="error"
                onClick={() => onDelete(c.idCliente)}
              >
                Desactivar
              </Button>
            ) : (
              <Button
                size="small"
                color="primary"
                onClick={() => onActivate(c.idCliente)}
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
        rows={clients || []}
        columns={columns}
        getRowId={(row) => row.idCliente}

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