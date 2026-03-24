import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ProductSidebar from "./POSVentaComponents/ProductSidebar";
import CartPanel from "./POSVentaComponents/CartPanel";
import CheckoutPanel from "./POSVentaComponents/CheckoutPanel";
import { getActiveProducts } from "../../services/productService";
import { getActiveClients } from "../../services/clientService";
import {registrarVenta} from "../../services/ventaService";
import { getCajaActivaByUsuario } from "../../services/cajaService";

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

  if (!cajaActiva) {
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          ⚠️ No tienes una caja abierta
        </Typography>
        <Typography>
          Pide al administrador que te abra una caja
        </Typography>
      </Box>
    );
  }
  

  return (
    <Box sx={{
      p: 3,
      background: "#f4f6f8",
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "360px 1fr 360px",
      gap: 3
    }}>
      <ProductSidebar productos={productos} onAdd={addItem} />
      <Box>
        <CartPanel items={items} onChangeQty={updateQuantity} onRemove={removeItem} />
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

  );
};


