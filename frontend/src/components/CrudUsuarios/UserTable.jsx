import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton, Button, Chip } from "@mui/material";
import { Edit, CheckCircle, Cancel } from "@mui/icons-material";

export default function UserTable({ 
  users,
  page,
  setPage,
  pageSize,
  setPageSize,
  totalRows,
   onEdit, 
   onDelete, 
   onActivate, 
   loading, 
   visibleColumns }){

  const columns = [
    { field: "idUsuario", headerName: "ID", width: 90 },
    { field: "username", headerName: "Usuario", width: 180 },
    
    { 
      field: "nombreCompleto", 
      headerName: "Nombre Completo", 
      width: 280,
    },

    { field: "documento", headerName: "Documento", width: 220 },
    
    { 
      field: "rol", 
      headerName: "Rol", 
      width: 180,
      // IMPORTANTE: Agrega estas validaciones de existencia
      valueGetter: (params) => {
        if (!params.row || !params.row.rol) return "";
        return params.row.rol.nombre || "";
      },
      renderCell: (params) => {
        // Si la fila o el rol no existen, no renderizamos nada o un placeholder
        const nombre = params.row?.rol?.nombre;
        if (!nombre) return null; 

        return (
          <Chip 
            label={nombre} 
            size="small" 
            color={nombre === "ADMINISTRADOR" ? "primary" : "secondary"} 
          />
        );
      }
    },


    { field: "email", headerName: "Email", width: 200 },
    
    {
      field: "estado",
      headerName: "Estado",
      width: 150,
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
        const u = params.row;
        const active = u.estado === true || u.estado === 1;

        return (
          <Box>
            <IconButton size="small" onClick={() => onEdit(u)}>
              <Edit />
            </IconButton>

            {active ? (
              <Button
                size="small"
                color="error"
                onClick={() => onDelete(u.idUsuario)}
              >
                Desactivar
              </Button>
            ) : (
              <Button
                size="small"
                color="primary"
                onClick={() => onActivate(u.idUsuario)}
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
        rows={users || []}
        columns={columns}
        getRowId={(row) => row.idUsuario}
        
        // Configuración de Paginación Servidor
        paginationMode="server"
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

        // Configuración de Carga
        loading={loading}
        
      />
    </Box>
  );
}