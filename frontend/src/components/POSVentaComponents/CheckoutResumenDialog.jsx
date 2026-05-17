import {
  Dialog, DialogContent, DialogActions,
  Typography, Box, Button, Divider,
  Table, TableBody, TableCell, TableHead, TableRow,
  Chip, CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  Payments as PaymentsIcon,
  AccountBalance as AccountBalanceIcon,
  Print as PrintIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { NEGOCIO } from "../../config/businessConfig";

// ── Helper: nombre del cliente ────────────────────────────────────────
const getClientName = (c) =>
  c?.razonSocial ?? `${c?.primerNombre ?? ""} ${c?.primerApellido ?? ""}`.trim();

// ── Formateador de moneda colombiana ─────────────────────────────────
const fmt = (n) => Number(n ?? 0).toLocaleString("es-CO");

// ── Fecha y hora actual formateada ────────────────────────────────────
const getNow = () => {
  const d = new Date();
  return {
    fecha: d.toLocaleDateString("es-CO",
      { day: "2-digit", month: "2-digit", year: "numeric" }),
    hora: d.toLocaleTimeString("es-CO"),
    fechaHora: d.toLocaleString("es-CO"),
  };
};

// ════════════════════════════════════════════════════════════════
// Componente interno: Ticket térmico imprimible
// ════════════════════════════════════════════════════════════════
const TicketContent = ({ cliente, metodoPago, items, total,
  totalIVA, totalSinIVA, montoRecibido, cambio, cajaActiva }) => {
  const { fecha, hora } = getNow();
  const cajero  = localStorage.getItem("username") ?? "";
  const idCaja  = cajaActiva?.idCaja ?? "—";

  return (
    <Box
      id="ticket-print"
      sx={{
        fontFamily: "monospace",
        fontSize: "11px",
        width: "100%",
        lineHeight: 1.6,
      }}
    >
      {/* Encabezado del negocio */}
      <Box sx={{ textAlign: "center", mb: 0.5 }}>
        <div style={{ fontWeight: "bold", fontSize: 13 }}>{NEGOCIO.nombre}</div>
        <div>NIT: {NEGOCIO.nit}</div>
        <div>Tel: {NEGOCIO.telefono}</div>
        <div>{NEGOCIO.direccion}</div>
      </Box>

      <hr style={{ border: "none", borderTop: "1px dashed #000", margin: "6px 0" }} />

      <Box sx={{ textAlign: "center", mb: 0.5 }}>
        <div style={{ fontWeight: "bold" }}>COMPROBANTE DE VENTA</div>
        <div>{fecha} {hora}</div>
        <div>Caja #{idCaja} · {cajero}</div>
      </Box>

      <hr style={{ border: "none", borderTop: "1px dashed #000", margin: "6px 0" }} />

      {/* Cliente */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Cliente:</span>
        <span>{getClientName(cliente)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Doc:</span>
        <span>{cliente?.documento}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Pago:</span>
        <span>{metodoPago}</span>
      </div>

      <hr style={{ border: "none", borderTop: "1px dashed #000", margin: "6px 0" }} />

      {/* Items */}
      {items.map((i) => (
        <div key={i.idProducto} style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ maxWidth: "65%", overflow: "hidden" }}>
            {i.nombre} x{i.cantidad}
          </span>
          <span>${fmt(i.precioUnitario * i.cantidad)}</span>
        </div>
      ))}

      <hr style={{ border: "none", borderTop: "1px dashed #000", margin: "6px 0" }} />

      {/* Totales */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Subtotal:</span><span>${fmt(totalSinIVA)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>IVA:</span><span>${fmt(totalIVA)}</span>
      </div>

      <hr style={{ border: "none", borderTop: "1px dashed #000", margin: "6px 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: 13 }}>
        <span>TOTAL:</span><span>${fmt(total)}</span>
      </div>

      {metodoPago === "EFECTIVO" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Recibido:</span><span>${fmt(montoRecibido)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Cambio:</span><span>${fmt(cambio)}</span>
          </div>
        </>
      )}

      <hr style={{ border: "none", borderTop: "1px dashed #000", margin: "6px 0" }} />

      <Box sx={{ textAlign: "center" }}>
        <div>{NEGOCIO.gracias}</div>
        <div>{NEGOCIO.eslogan}</div>
      </Box>
    </Box>
  );
};

// ════════════════════════════════════════════════════════════════
// Componente principal
// ════════════════════════════════════════════════════════════════
const CheckoutResumenDialog = ({
  open, onClose, cliente, metodoPago, observaciones,
  items = [], montoRecibido, total, totalIVA, totalSinIVA,
  cambio, loadingVenta, onConfirm, cajaActiva,
}) => {
  if (!cliente) return null;

  const { fechaHora } = getNow();
  const idCaja = cajaActiva?.idCaja ?? "—";

  // ── Lógica de impresión — es presentación pura, va aquí ──────────
  const handlePrint = () => {
    const printContents = document.getElementById("ticket-print").innerHTML;
    const win = window.open("", "_blank", "width=420,height=700");
    win.document.write(`
      <html>
        <head>
          <title>Ticket · ${NEGOCIO.nombre}</title>
          <style>
            body { font-family: monospace; padding: 16px; width: 360px; margin: 0 auto; }
            hr   { border: none; border-top: 1px dashed #000; margin: 6px 0; }
            div  { margin: 1px 0; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  const handleConfirmAndPrint = async () => {
    await onConfirm();
    handlePrint();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: { width: { xs: "95vw", md: 820 }, borderRadius: 3, overflow: "hidden" },
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          px: 3, py: 2,
          background: "linear-gradient(135deg, #1565c0, #1976d2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={700} color="white">
            Resumen de Venta
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)" }}>
            Revisa los detalles antes de confirmar · Caja #{idCaja}
          </Typography>
        </Box>
        <Chip
          label={fechaHora}
          size="small"
          sx={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white",
            fontSize: "0.7rem", fontWeight: 600 }}
        />
      </Box>

      {/* ── Body: dos columnas ── */}
      <DialogContent sx={{ p: 0, display: "flex", minHeight: 420 }}>

        {/* Columna izquierda — resumen visual */}
        <Box sx={{ flex: 1, p: 2.5, backgroundColor: "grey.50",
          display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>

          {/* Cliente */}
          <Box sx={{ backgroundColor: "background.paper", borderRadius: 2,
            p: 2, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="caption" fontWeight={700} color="text.disabled"
              textTransform="uppercase" letterSpacing="0.08em" display="block" mb={1}>
              Cliente
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: "50%",
                backgroundColor: "primary.light", display: "flex",
                alignItems: "center", justifyContent: "center" }}>
                <PersonIcon sx={{ color: "primary.main", fontSize: 22 }} />
              </Box>
              <Box>
                <Typography variant="body2" fontWeight={700}>
                  {getClientName(cliente)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {cliente?.tipoDocumento?.replace(/_/g, " ")} · {cliente?.documento}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Productos */}
          <Box sx={{ backgroundColor: "background.paper", borderRadius: 2,
            p: 2, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="caption" fontWeight={700} color="text.disabled"
              textTransform="uppercase" letterSpacing="0.08em" display="block" mb={1}>
              Productos ({items.length} {items.length === 1 ? "item" : "items"})
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "text.disabled", fontSize: "0.7rem",
                    fontWeight: 700, textTransform: "uppercase", pb: 0.5 }}>
                    Producto
                  </TableCell>
                  <TableCell align="center" sx={{ color: "text.disabled",
                    fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>
                    Cant.
                  </TableCell>
                  <TableCell align="right" sx={{ color: "text.disabled",
                    fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>
                    Subtotal
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((i) => (
                  <TableRow key={i.idProducto}
                    sx={{ "&:last-child td": { border: 0 } }}>
                    <TableCell sx={{ fontSize: "0.82rem", py: 0.8 }}>
                      {i.nombre}
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: "0.82rem" }}>
                      {i.cantidad}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: "0.82rem", fontWeight: 600 }}>
                      ${fmt(i.precioUnitario * i.cantidad)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Divider sx={{ my: 1.5 }} />

            {/* Totales */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="caption" color="text.secondary">Subtotal sin IVA</Typography>
                <Typography variant="caption" fontWeight={600}>${fmt(totalSinIVA)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="caption" color="text.secondary">IVA</Typography>
                <Typography variant="caption" fontWeight={600}>${fmt(totalIVA)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between",
                mt: 0.5, pt: 1, borderTop: "2px solid", borderColor: "primary.light" }}>
                <Typography variant="subtitle2" fontWeight={700}>TOTAL</Typography>
                <Typography variant="h6" fontWeight={800} color="primary.main">
                  ${fmt(total)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Pago */}
          <Box sx={{ backgroundColor: "background.paper", borderRadius: 2,
            p: 2, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="caption" fontWeight={700} color="text.disabled"
              textTransform="uppercase" letterSpacing="0.08em" display="block" mb={1}>
              Método de pago
            </Typography>
            <Chip
              icon={metodoPago === "EFECTIVO" ? <PaymentsIcon /> : <AccountBalanceIcon />}
              label={metodoPago}
              color="success"
              variant="outlined"
              size="small"
            />
            {metodoPago === "EFECTIVO" && (
              <Box sx={{ mt: 1.5, p: 1.5, backgroundColor: "success.50",
                borderRadius: 2, border: "1px solid", borderColor: "success.light",
                display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Recibido</Typography>
                  <Typography variant="body2" fontWeight={700}>${fmt(montoRecibido)}</Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="caption" color="success.dark">Cambio</Typography>
                  <Typography variant="subtitle1" fontWeight={800} color="success.dark">
                    ${fmt(cambio)}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Observaciones — solo si hay */}
          {observaciones && (
            <Box sx={{ backgroundColor: "background.paper", borderRadius: 2,
              p: 2, border: "1px solid", borderColor: "divider" }}>
              <Typography variant="caption" fontWeight={700} color="text.disabled"
                textTransform="uppercase" letterSpacing="0.08em" display="block" mb={0.5}>
                Observaciones
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {observaciones}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Columna derecha — preview ticket térmico */}
        <Box
          sx={{
            width: 240,
            borderLeft: "1px solid",
            borderColor: "divider",
            backgroundColor: "#f0f0f0",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            alignItems: "center",
            p: 2,
            gap: 1,
            overflowY: "auto",
          }}
        >
          <Typography variant="caption" fontWeight={700} color="text.disabled"
            textTransform="uppercase" letterSpacing="0.08em">
            Preview ticket
          </Typography>

          {/* Efecto borde dentado arriba */}
          <Box sx={{ width: "100%", height: 8,
            backgroundImage: "radial-gradient(circle, #f0f0f0 6px, #fff 6px)",
            backgroundSize: "14px 8px", backgroundRepeat: "repeat-x" }} />

          <Box sx={{ backgroundColor: "white", width: "100%", px: 2, py: 1.5,
            boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}>
            <TicketContent
              cliente={cliente}
              metodoPago={metodoPago}
              items={items}
              total={total}
              totalIVA={totalIVA}
              totalSinIVA={totalSinIVA}
              montoRecibido={montoRecibido}
              cambio={cambio}
              cajaActiva={cajaActiva}
            />
          </Box>

          {/* Efecto borde dentado abajo */}
          <Box sx={{ width: "100%", height: 8,
            backgroundImage: "radial-gradient(circle, #f0f0f0 6px, #fff 6px)",
            backgroundSize: "14px 8px", backgroundRepeat: "repeat-x",
            transform: "rotate(180deg)" }} />
        </Box>
      </DialogContent>

      {/* ── Footer ── */}
      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid",
        borderColor: "divider", justifyContent: "space-between" }}>
        <Button onClick={onClose} disabled={loadingVenta}>
          Cancelar
        </Button>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          {/* Solo imprimir sin confirmar — útil para cotizaciones */}
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            disabled={loadingVenta}
          >
            Solo imprimir
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={loadingVenta
              ? <CircularProgress size={16} color="inherit" />
              : <CheckCircleIcon />}
            onClick={handleConfirmAndPrint}
            disabled={loadingVenta}
            sx={{ fontWeight: 700, px: 3 }}
          >
            {loadingVenta ? "Procesando..." : "Confirmar y cobrar"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutResumenDialog;