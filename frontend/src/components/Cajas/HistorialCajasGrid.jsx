import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { formatDateTime, formatMoney } from "../../utils/formats";

export default function HistorialCajasGrid({
  rows,
  totalRows,
  page,
  onPageChange,
  onVerDetalle,
  loading
}) {

  const columns = [
    { field: "idCaja", headerName: "Caja", width: 90 },
    { field: "nombreCajero", headerName: "Cajero", flex: 1 },
    {
      field: "fechaApertura",
      headerName: "Apertura",
      flex: 1,
      renderCell: (params) => formatDateTime(params.value),
    },
    {
      field: "fechaCierre",
      headerName: "Cierre",
      flex: 1,
      renderCell: (params) =>
        params.value ? formatDateTime(params.value) : "—",
    },
    {
      field: "montoFinal",
      headerName: "Monto final",
      flex: 1,
      renderCell: (params) => formatMoney(params.value),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 150,
      renderCell: (params) => (
        <Button onClick={() => onVerDetalle(params.row.idCaja)}>
          Ver detalle
        </Button>
      ),
    },
  ];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      getRowId={(row) => row.idCaja}
      paginationMode="server"
      rowCount={totalRows}
      pageSizeOptions={[10]}
      pageSize={10}
      page={page}
      onPageChange={onPageChange}
      autoHeight
      loading={loading}
    />
  );
}