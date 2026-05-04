import { DataGrid } from "@mui/x-data-grid";
import { Chip } from "@mui/material";

export default function InventarioGrid({ rows }) {

  const getEstado = (row) => {
    if (row.stockActual === 0) return { label: "Sin stock", color: "error" };
    if (row.stockActual <= row.stockMinimo) return { label: "Bajo", color: "warning" };
    return { label: "Normal", color: "success" };
  };

  const columns = [
    { field: "idProducto", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Producto", flex: 1 },
    { field: "stockActual", headerName: "Stock", width: 120 },
    { field: "stockMinimo", headerName: "Stock mínimo", width: 140 },
    {
      field: "estado",
      headerName: "Estado",
      width: 140,
      renderCell: (params) => {
        const estado = getEstado(params.row);
        return <Chip label={estado.label} color={estado.color} />;
      }
    }
  ];

  return (
    <DataGrid
      rows={rows}
      getRowId={(row) => row.idProducto}
      columns={columns}
      autoHeight
      pageSizeOptions={[10]}
    />
  );
}