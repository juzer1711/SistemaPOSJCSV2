import { Box, Typography, Button } from "@mui/material";
import { useVentaPOS } from "../hooks/pos/useVentaPOS";
import ProductSidebar from "../components/POSVentaComponents/ProductSidebar";
import CartPanel from "../components/POSVentaComponents/CartPanel";
import CheckoutPanel from "../components/POSVentaComponents/CheckoutPanel";
import DialogAbrirCaja from "../components/POSVentaComponents/DialogAbrirCaja";
import DialogCerrarCaja from "../components/POSVentaComponents/DialogCerrarCaja";
import DialogReporteCierre from "../components/POSVentaComponents/DialogReporteCierre";
import DialogMovimientoCaja from "../components/POSVentaComponents/DialogMovimientoCaja";

export default function VentaPOS() {
  const {
    // Datos
    productos,
    clientes,
    // Carrito
    items,
    clienteSeleccionado,
    setClienteSeleccionado,
    metodoPago,
    setMetodoPago,
    montoRecibido,
    setMontoRecibido,
    observaciones,
    setObservaciones,
    // Caja
    cajaActiva,
    loadingCaja,
    openCajaModal,
    openCerrarCaja,
    setOpenCerrarCaja,
    reporteCierre,
    openMovimiento,
    setOpenMovimiento,
    // Handlers carrito
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    loadProductos,
    // Handlers caja
    handleAbrirCaja,
    handleCerrarCaja,
    handleCierreReporteClose,
  } = useVentaPOS();

  if (loadingCaja) {
    return <div>Cargando caja...</div>;
  }

  return (
    <>
      {/* HEADER POS */}
      <Box
        sx={{
          height: 70,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "white",
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Punto de Venta
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Caja activa #{cajaActiva?.idCaja} — Usuario{" "}
            {localStorage.getItem("username")}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2">
            {new Date().toLocaleTimeString()}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenMovimiento(true)}
            disabled={!cajaActiva}
          >
            Movimiento Caja
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenCerrarCaja(true)}
            disabled={!cajaActiva}
          >
            Cerrar Caja
          </Button>
        </Box>
      </Box>

      {/* GRID PRINCIPAL */}
      <Box
        sx={{
          p: 2,
          height: "calc(100vh - 70px)",
          display: "grid",
          gridTemplateColumns: "340px 1fr 380px",
          gap: 2,
          backgroundColor: "#F4F6F8",
          opacity: cajaActiva ? 1 : 0.4,
          pointerEvents: cajaActiva ? "auto" : "none",
        }}
      >
        <ProductSidebar productos={productos} onAdd={addItem} />

        <CartPanel
          items={items}
          onChangeQty={updateQuantity}
          onRemove={removeItem}
        />

        <CheckoutPanel
          clientes={clientes}
          items={items}
          clienteSeleccionado={clienteSeleccionado}
          setClienteSeleccionado={setClienteSeleccionado}
          metodoPago={metodoPago}
          setMetodoPago={setMetodoPago}
          montoRecibido={montoRecibido}
          setMontoRecibido={setMontoRecibido}
          observaciones={observaciones}
          setObservaciones={setObservaciones}
          registrarVenta={null}
          clearCart={clearCart}
          reloadProductos={loadProductos}
          cajaActiva={cajaActiva}
        />

        <DialogMovimientoCaja
          open={openMovimiento}
          onClose={() => setOpenMovimiento(false)}
          cajaActiva={cajaActiva}
        />
      </Box>

      {/* DIALOGS */}
      <DialogAbrirCaja
        open={openCajaModal}
        onClose={() => {}}
        onConfirm={handleAbrirCaja}
      />

      <DialogCerrarCaja
        open={openCerrarCaja}
        onClose={() => setOpenCerrarCaja(false)}
        cajaActiva={cajaActiva}
        onConfirm={handleCerrarCaja}
      />

      <DialogReporteCierre
        open={!!reporteCierre}
        reporte={reporteCierre}
        onClose={handleCierreReporteClose}
      />
    </>
  );
}