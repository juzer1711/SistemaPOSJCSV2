import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton, Button, Chip, Tooltip } from "@mui/material";
import { Edit, CheckCircle, Cancel } from "@mui/icons-material";

export default function UserTable({
  users, page, setPage, pageSize, setPageSize,
  totalRows, onEdit, onDelete, onActivate,
  loading, visibleColumns,
  setSortBy,
}) {

  const columns = [
    { field: "idUsuario", headerName: "ID", width: 100 },
    { field: "username", headerName: "Usuario", width: 200 },
    { field: "nombreCompleto", headerName: "Nombre Completo", width: 280 },
    { field: "documento", headerName: "Documento", width: 200 },

    {
      field: "rol",
      headerName: "Rol",
      width: 200,
      valueGetter: (value, row) => row?.rol?.nombre ?? "",
      renderCell: (params) => {
        const nombre = params.row?.rol?.nombre;
        if (!nombre) return null;
        return (
          <Chip
            label={nombre}
            size="small"
            color={nombre === "ADMINISTRADOR" ? "primary" : "secondary"}
          />
        );
      },
    },

    { field: "email", headerName: "Email", width: 250 },

    {
      field: "estado",
      headerName: "Estado",
      width: 130,
      renderCell: (params) => {
        const active = params.value === true || params.value === 1;
        return (
          <Chip
            icon={active ? <CheckCircle /> : <Cancel />}
            label={active ? "Activo" : "Inactivo"}
            size="small"
            color={active ? "success" : "default"}
          />
        );
      },
    },

    {
      field: "acciones",
      headerName: "Acciones",
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const u = params.row;
        const active = u.estado === true || u.estado === 1;
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Tooltip title="Editar usuario" arrow>
              <IconButton size="small" onClick={() => onEdit(u)}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={active ? "Desactivar usuario" : "Activar usuario"} arrow>
              <Button
                size="small"
                color={active ? "error" : "primary"}
                variant="outlined"
                sx={{ fontSize: 11, py: 0.3 }}
                onClick={() => active ? onDelete(u.idUsuario) : onActivate(u.idUsuario)}
              >
                {active ? "Desactivar" : "Activar"}
              </Button>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: 550, width: "100%" }}>
      <DataGrid
        rows={users || []}
        columns={columns}
        getRowId={(row) => row.idUsuario}
        paginationMode="server"
        rowCount={totalRows || 0}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
        }}
        sortingMode="server"
        onSortModelChange={(model) => {
          if (model.length > 0) {
            setSortBy({ key: model[0].field, direction: model[0].sort });
          }
        }}
        loading={loading}
      />
    </Box>
  );
}