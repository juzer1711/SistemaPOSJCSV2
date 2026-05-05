import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Snackbar, Alert} from "@mui/material";
import ProductSidebar from "./POSVentaComponents/ProductSidebar";
import CartPanel from "./POSVentaComponents/CartPanel";
import CheckoutPanel from "./POSVentaComponents/CheckoutPanel";
import { getActiveProducts } from "../../services/productService";
import { getActiveClients } from "../../services/clientService";
import {registrarVenta} from "../../services/ventaService";
import { getCajaActivaByUsuario } from "../../services/cajaService";
import DialogAbrirCaja from "./POSVentaComponents/DialogAbrirCaja";
import DialogCerrarCaja from "./POSVentaComponents/DialogCerrarCaja";
import DialogReporteCierre from "./POSVentaComponents/DialogReporteCierre";
import { abrirCaja, cerrarCaja, getCajasAbiertas } from "../../services/cajaService";
import DialogMovimientoCaja from "./POSVentaComponents/DialogMovimientoCaja";
import { useNavigate } from "react-router-dom";

export default function VentaPOS () {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [cajaActual, setCajaActual] = useState(null);
  const [openMovimiento, setOpenMovimiento] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarCaja = async () => {
      try {
        const response = await getCajasAbiertas();
        const cajas = response.data.content;

        const idUsuario = localStorage.getItem("id_usuario");

        const caja = cajas.find(
          (c) => String(c.idUsuario) === String(idUsuario)
        );

        setCajaActual(caja);

      } catch (error) {
        console.error("Error cargando caja:", error);
      }
    };

    cargarCaja();
  }, []);

  const [cajaActiva, setCajaActiva] = useState(null);
  const [openCajaModal, setOpenCajaModal] = useState(false);
  const [openCerrarCaja, setOpenCerrarCaja] = useState(false);
  const [reporteCierre, setReporteCierre] = useState(null);

  const [montoInicial, setMontoInicial] = useState("");

  const [loadingCaja, setLoadingCaja] = useState(true);
  // Estado del carrito vivo (idProducto, nombre, precio, cantidad)
  const [items, setItems] = useState(() => {
    const data = localStorage.getItem("pos_venta");
    return data ? JSON.parse(data).items || [] : [];
  });

  const [clienteSeleccionado, setClienteSeleccionado] = useState(() => {
    const data = localStorage.getItem("pos_venta");
    return data ? JSON.parse(data).clienteSeleccionado || null : null;
  });

  const [metodoPago, setMetodoPago] = useState(() => {
    const data = localStorage.getItem("pos_venta");
    return data ? JSON.parse(data).metodoPago || "" : "";
  });

  const [montoRecibido, setMontoRecibido] = useState(() => {
    const data = localStorage.getItem("pos_venta");
    return data ? JSON.parse(data).montoRecibido || "" : "";
  });

  const [observaciones, setObservaciones] = useState(() => {
    const data = localStorage.getItem("pos_venta");
    return data ? JSON.parse(data).observaciones || "" : "";
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

const loadProductos = async () => {
  try {
    const res = await getActiveProducts();
    setProductos(res.data.content || []);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  const loadData = async () => {
    try {
      const [p, c] = await Promise.all([
        getActiveProducts(),
        getActiveClients()
      ]);

      setProductos(p.data.content || []);
      setClientes(c.data.content || []);
    } catch (err) {
      console.error("Error cargando datos POS", err);
    }
  };

  loadData();
}, []);

  useEffect(() => {
  const data = {
    items,
    clienteSeleccionado,
    metodoPago,
    montoRecibido,
    observaciones
  };

  localStorage.setItem("pos_venta", JSON.stringify(data));

}, [items, clienteSeleccionado, metodoPago, montoRecibido, observaciones]);

useEffect(() => {
  const fetchCaja = async () => {
    const idUsuario = localStorage.getItem("id_usuario");
    try {
      const res = await getCajaActivaByUsuario(Number(idUsuario));
      setCajaActiva(res.data);
    } catch (error) {
      setCajaActiva(null);
    } finally {
      setLoadingCaja(false);
    }
  };

  fetchCaja();
}, []);

useEffect(() => {
  if (!loadingCaja && !cajaActiva) {
    setOpenCajaModal(true);
  }
}, [loadingCaja, cajaActiva]);


  // Añadir producto al carrito (incrementa si ya existe)
const addItem = (producto) => {
  if (!producto?.idProducto) return;

  // 🔥 ALERTAS
  if (producto.stockActual <= 0) {
    showMessage("⚠ Producto sin stock (venta permitida)", "warning");
  } else if (producto.stockActual <= producto.stockMinimo) {
    showMessage("⚠ Stock bajo", "warning");
  }

  // 🔥 AGREGAR AL CARRITO
  setItems(prev => {
    const found = prev.find(i => i.idProducto === producto.idProducto);

    if (found) {
      return prev.map(i =>
        i.idProducto === producto.idProducto
          ? { ...i, cantidad: i.cantidad + 1 }
          : i
      );
    }

    return [
      ...prev,
      {
        idProducto: producto.idProducto,
        nombre: producto.nombre,
        precioUnitario: Number(producto.precioventa),
        ivaPorcentaje: producto.iva.value,
        precioSinIva: Number(producto.precioSinIva),
        cantidad: 1
      }
    ];
  });
};

  const updateQuantity = (idProducto, cantidad) => {
    setItems(prev => prev.map(i => i.idProducto === idProducto ? { ...i, cantidad } : i));
  };

  const removeItem = (idProducto) => setItems(prev => prev.filter(i => i.idProducto !== idProducto));

  const clearCart = () => { setItems([]); setClienteSeleccionado(null); setMetodoPago(""); setMontoRecibido(""); setObservaciones(""); localStorage.removeItem("pos_venta"); };

  if (loadingCaja) {
    return <div>Cargando caja...</div>;
  }

  const handleAbrirCaja = async (montoInicial, password) => {
    try {
      const idUsuario = Number(localStorage.getItem("id_usuario"));

      await abrirCaja({
        idUsuario: idUsuario,
        montoInicial: Number(montoInicial)  // 🔥🔥🔥 ESTA LÍNEA
      });

      setOpenCajaModal(false);

      const res = await getCajaActivaByUsuario(idUsuario);
      setCajaActiva(res.data);

    } catch (e) {
      console.error(e);
    }
  };

  const handleCerrarCaja = async (efectivoReal, transferenciaReal) => {
    try {
      const idUsuario = localStorage.getItem("id_usuario");

      // ✅ CAPTURAS la respuesta del backend
      const res = await cerrarCaja({
        idUsuario,
        efectivoReal,
        transferenciaReal
      });

      // 🔥 1. Guardas el reporte que devuelve el backend
      setReporteCierre(res);

      // 🔥 2. Mensaje éxito
      showMessage("Caja cerrada correctamente", "success");

      // 🔥 3. Cerrar modal
      setOpenCerrarCaja(false);

      // 🔥 4. Limpiar POS
      clearCart();

    } catch (e) {
      console.error(e);
    }
  };

  const showMessage = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

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
      {/* Izquierda */}
      <Box>
        <Typography variant="h6" fontWeight="bold">
          Punto de Venta
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Caja activa #{cajaActiva?.idCaja} — Usuario {localStorage.getItem("username")}
        </Typography>
      </Box>

      {/* Derecha */}
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
        registrarVenta={registrarVenta}
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
          {/* 🔥 MODAL */}
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
      onClose={() => {
        setReporteCierre(null);
        const role = localStorage.getItem("role");
        navigate(
          role === "ADMINISTRADOR"
            ? "/admin-dashboard"
            : "/cajero-dashboard"
        );// 🔥 salida elegante del POS
      }}
    />
    <Snackbar
      open={snackbar.open}
      autoHideDuration={2500}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
    >
      <Alert
        severity={snackbar.severity}
        variant="filled"
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
    </>
);};


