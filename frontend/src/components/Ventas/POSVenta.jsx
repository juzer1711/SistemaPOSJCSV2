import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import ProductSidebar from "./POSVentaComponents/ProductSidebar";
import CartPanel from "./POSVentaComponents/CartPanel";
import CheckoutPanel from "./POSVentaComponents/CheckoutPanel";
import { getActiveProducts } from "../../services/productService";
import { getActiveClients } from "../../services/clientService";
import {registrarVenta} from "../../services/ventaService";
import { getCajaActivaByUsuario } from "../../services/cajaService";
import DialogAbrirCaja from "./POSVentaComponents/DialogAbrirCaja";
import DialogCerrarCaja from "./POSVentaComponents/DialogCerrarCaja";
import { abrirCaja, cerrarCaja } from "../../services/cajaService";

export default function VentaPOS () {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [cajaActual, setCajaActual] = useState(null);

  useEffect(() => {
    const cargarCaja = async () => {
      try {
        const response = await getCajasAbiertas();
        const cajas = response.data;

        const idUsuario = localStorage.getItem("id_usuario");

        console.log("CAJAS COMPLETAS:", cajas);

        const caja = cajas.find(
          (c) => String(c.idUsuario) === String(idUsuario)
        );

        console.log("CAJA DETECTADA:", caja);

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

  useEffect(() => {
    (async () => {
      try {
        const p = await getActiveProducts();
        setProductos(p.data || []);
        const c = await getActiveClients();
        setClientes(c.data || []);
      } catch (err) {
        console.error("Error cargando datos POS", err);
      }
    })();
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
  const addItem = (prod) => {
    if (!prod?.idProducto) return;
    setItems(prev => {
      const found = prev.find(i => i.idProducto === prod.idProducto);
      if (found) {
        return prev.map(i => i.idProducto === prod.idProducto ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      return [...prev, { idProducto: prod.idProducto, nombre: prod.nombre, precioUnitario: Number(prod.precioventa), ivaPorcentaje: prod.iva.value,         // 0.19 por ejemplo
        precioSinIva: Number(prod.precioSinIva),cantidad: 1 }];
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
      const idUsuario = localStorage.getItem("id_usuario");

      await abrirCaja({
        idUsuario,
        montoInicial
      });

      setOpenCajaModal(false);

      const res = await getCajaActivaByUsuario(Number(idUsuario));
      setCajaActiva(res.data);

    } catch (e) {
      console.error(e);
    }
  };

  const handleCerrarCaja = async (efectivoReal, transferenciaReal) => {
    try {
      const idUsuario = localStorage.getItem("id_usuario");

      await cerrarCaja({
        idUsuario,
        efectivoReal,
        transferenciaReal
      });

      setOpenCerrarCaja(false);

      setCajaActiva(null); // 🔥 esto bloquea el POS otra vez
      clearCart();

    } catch (e) {
      console.error(e);
    }
  };
  
  return (
  <>
    <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
      <Button
        variant="contained"
        color="error"
        onClick={() => setOpenCerrarCaja(true)}
        disabled={!cajaActiva}
      >
        Cerrar Caja
      </Button>
    </Box>
    <Box sx={{
      p: 3,
      background: "#f4f6f8",
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "360px 1fr 360px",
      gap: 3,
      opacity: cajaActiva ? 1 : 0.5,
      pointerEvents: cajaActiva ? "auto" : "none"
    }}>
      <ProductSidebar productos={productos} onAdd={addItem} />

      <Box>
        <CartPanel
          items={items}
          onChangeQty={updateQuantity}
          onRemove={removeItem}
        />
      </Box>

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
  </>
);};


