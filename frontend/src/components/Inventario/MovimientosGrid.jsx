import { DataGrid } from "@mui/x-data-grid";
import Chip from '@mui/material/Chip';

export default function MovimientosGrid({
  rows,
  totalRows,
  page,
  onPageChange,
  onRowClick 
}) {

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "nombreProducto",
      headerName: "Producto",
      flex: 1
    },
    {
      field: "tipo",
      headerName: "Tipo",
      width: 130,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          color={
            value === "ENTRADA"
              ? "success"
              : value === "SALIDA"
              ? "error"
              : "info" 
          }
        />
      )
    },
    { field: "cantidad", headerName: "Cantidad", width: 120 },
    {
      field: "fecha",
      headerName: "Fecha",
      width: 180,
      valueGetter: (value) => {
        if (!value) return null;
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
      },
      valueFormatter: (value) => {
        if (!value) return "";
        return value.toLocaleString("es-CO", {
          dateStyle: "short",
          timeStyle: "short"
        });
      },
    }
  ];

  return (
    <DataGrid
      rows={rows}
      getRowId={(row) => row.id}
      columns={columns}
      rowCount={totalRows}
      onRowClick={(params) => onRowClick(params.row)}
      paginationMode="server"
      pageSizeOptions={[10]}
      paginationModel={{ page, pageSize: 10 }}
      onPaginationModelChange={(model) => onPageChange(model.page)}
      autoHeight
    />
  );
}