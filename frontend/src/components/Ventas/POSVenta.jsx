import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ProductSidebar from "./POSVentaComponents/ProductSidebar";
import CartPanel from "./POSVentaComponents/CartPanel";
import CheckoutPanel from "./POSVentaComponents/CheckoutPanel";
import { getActiveProducts } from "../../services/productService";
import { getActiveClients } from "../../services/clientService";
import {registrarVenta} from "../../services/ventaService";

export default function VentaPOS () {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);

  // Estado del carrito vivo (idProducto, nombre, precio, cantidad)
  const [items, setItems] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [metodoPago, setMetodoPago] = useState("");
  const [montoRecibido, setMontoRecibido] = useState("");
  const [observaciones, setObservaciones] = useState("");

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

  const clearCart = () => { setItems([]); setClienteSeleccionado(null); setMetodoPago(""); setMontoRecibido(""); setObservaciones(""); };

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
      />
    </Box>

  );
};


