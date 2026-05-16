import { useEffect, useState } from "react";
import {
  searchCajas,
  abrirCaja,
  getCajaById,
  forzarCierreCaja,
} from "../../services/cajaService";
import { searchUsers } from "../../services/userService";
import { abrirCajaSchema } from "../../validation/validationSchema";
import { useSnackbar } from "../../context/SnackBarProvider";

export const useCajaManagement = () => {
  // 🔹 Estados principales
  const [usuarios, setUsuarios] = useState([]);
  const [cajasAbiertas, setCajasAbiertas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [cajaSeleccionada, setCajaSeleccionada] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // ================= PAGINACIONES =================
  const [pageAbiertas, setPageAbiertas] = useState(0);
  const [pageHistorial, setPageHistorial] = useState(0);
  const size = 10;
  const [totalRowsAbiertas, setTotalRowsAbiertas] = useState(0);
  const [totalRowsHistorial, setTotalRowsHistorial] = useState(0);

  // ================= FILTROS =================
  const [filtroAbiertas, setFiltroAbiertas] = useState({
    cajero: "",
    fecha: "",
  });

  const [filtroHistorial, setFiltroHistorial] = useState({
    fechaInicio: "",
    fechaFin: "",
    cajero: "",
  });

  const [form, setForm] = useState({
    usuario: null,
    montoInicial: "",
  });

  const [errores, setErrores] = useState({});
  const [saving, setSaving] = useState(false);
  const [loadingAbiertas, setLoadingAbiertas] = useState(false);
  const [loadingCerradas, setLoadingCerradas] = useState(false);
  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);

  const { showSnackbar } = useSnackbar();

  // ================== LOADERS ==================

  useEffect(() => {
    loadUsuarios();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadUsuarios();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [busquedaUsuario]);

  useEffect(() => {
    loadCajasAbiertas();
  }, [pageAbiertas, filtroAbiertas]);

  useEffect(() => {
    loadHistorial();
  }, [pageHistorial, filtroHistorial]);

  const loadUsuarios = async () => {
    try {
      setLoadingUsuarios(true);
      const res = await searchUsers({
        page: 0,
        size: 20,
        search: busquedaUsuario,
      });
      setUsuarios(res.data.content || []);
    } finally {
      setLoadingUsuarios(false);
    }
  };

  const loadCajasAbiertas = async () => {
    try {
      setLoadingAbiertas(true);
      const res = await searchCajas({
        page: pageAbiertas,
        size,
        search: filtroAbiertas.cajero || undefined,
        fechaApertura: filtroAbiertas.fecha || undefined,
        estado: "ABIERTA",
      });
      setCajasAbiertas(res.data.content);
      setTotalRowsAbiertas(res.data.totalElements);
    } finally {
      setLoadingAbiertas(false);
    }
  };

  const loadHistorial = async () => {
    try {
      setLoadingCerradas(true);
      const res = await searchCajas({
        page: pageHistorial,
        size,
        search: filtroHistorial.cajero || undefined,
        fechaApertura: filtroHistorial.fechaInicio
          ? `${filtroHistorial.fechaInicio}T00:00:00`
          : undefined,
        fechaCierre: filtroHistorial.fechaFin
          ? `${filtroHistorial.fechaFin}T23:59:59`
          : undefined,
        estado: "CERRADA",
      });
      setHistorial(res.data.content);
      setTotalRowsHistorial(res.data.totalElements);
    } finally {
      setLoadingCerradas(false);
    }
  };

  // ================== ACCIONES ==================

  const handleAbrirCaja = async () => {
    try {
      setSaving(true);
      setErrores({});

      await abrirCajaSchema.validate(form, { abortEarly: false });

      await abrirCaja({
        idUsuario: form.usuario.idUsuario,
        montoInicial: Number(form.montoInicial),
      });

      showSnackbar("Caja abierta correctamente", "success");
      setForm({ usuario: null, montoInicial: "" });
      loadCajasAbiertas();
    } catch (err) {
      if (err.name === "ValidationError") {
        const erroresYup = {};
        err.inner.forEach((e) => {
          erroresYup[e.path] = e.message;
        });
        setErrores(erroresYup);
      } else {
        showSnackbar("Error al abrir la caja", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCerrarCaja = async (idCaja) => {
    try {
      await forzarCierreCaja(idCaja);
      showSnackbar("Caja cerrada correctamente", "success");
      loadCajasAbiertas();
      loadHistorial();
    } catch (e) {
      showSnackbar("Error al cerrar la caja", "error");
    }
  };

  const verDetalleCaja = async (idCaja) => {
    try {
      const res = await getCajaById(idCaja);
      setCajaSeleccionada(res.data);
      setDetailOpen(true);
    } catch {
      showSnackbar("No se pudo cargar el detalle de la caja", "error");
    }
  };

  return {
    // Datos
    usuarios,
    cajasAbiertas,
    historial,
    cajaSeleccionada,
    // Paginación
    pageAbiertas,
    setPageAbiertas,
    pageHistorial,
    setPageHistorial,
    totalRowsAbiertas,
    totalRowsHistorial,
    // Filtros
    filtroAbiertas,
    setFiltroAbiertas,
    filtroHistorial,
    setFiltroHistorial,
    // Formulario abrir caja
    form,
    setForm,
    errores,
    setErrores,
    saving,
    // Búsqueda usuario
    busquedaUsuario,
    setBusquedaUsuario,
    loadingUsuarios,
    // Loading grids
    loadingAbiertas,
    loadingCerradas,
    // Dialog
    detailOpen,
    setDetailOpen,
    // Handlers
    handleAbrirCaja,
    handleCerrarCaja,
    verDetalleCaja,
  };
};