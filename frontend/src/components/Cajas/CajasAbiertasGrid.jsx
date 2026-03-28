import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { formatDateTime, formatMoney } from "../../utils/formats";

export default function CajasAbiertasGrid({
  rows,
  totalRows,
  page,
  onPageChange,
  onVerDetalle,
  onForzarCierre,
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
      field: "montoInicial",
      headerName: "Monto inicial",
      flex: 1,
      renderCell: (params) => formatMoney(params.value),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 220,
      renderCell: (params) => (
        <>
          <Button onClick={() => onVerDetalle(params.row.idCaja)}>Ver</Button>
          <Button color="error" onClick={() => onForzarCierre(params.row.idCaja)}>
            Forzar cierre
          </Button>
        </>
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