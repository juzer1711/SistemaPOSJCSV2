import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createEmpresa, uploadLogo } from "../../services/empresaService";
import { empresaSchema } from "../../validation/validationSchema";
import { useEmpresa } from "../../context/EmpresaContext";

export const useRegistroEmpresa = () => {

  const navigate = useNavigate();
  const { cargarEmpresa } = useEmpresa();
  const fileInputRef = useRef(null);

  const [empresa, setEmpresa] = useState({
    nombreComercial: "",
    razonSocial: "",
    nit: "",
    direccion: "",
    telefono: "",
    correo: "",
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpresa((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLogoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMensaje("La imagen no puede superar 2MB");
      return;
    }

    setLogoFile(file);
    // Preview local antes de subir
    setLogoPreview(URL.createObjectURL(file));
    setMensaje("");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMensaje("");
      setFieldErrors({});

      await empresaSchema.validate(empresa, { abortEarly: false });

      // 1. Crear empresa
      const empresaCreada = await createEmpresa(empresa);

      // 2. Si eligió logo, subirlo
      if (logoFile) {
        await uploadLogo(logoFile);
      }

      // 3. Actualizar context global
      await cargarEmpresa();

      navigate("/login");

    } catch (error) {
      if (error.inner) {
        const errors = error.inner.reduce((acc, err) => {
          acc[err.path] = err.message;
          return acc;
        }, {});
        setFieldErrors(errors);
      } else {
        setMensaje(
          error?.response?.data?.message ||
          error?.message ||
          "Error al registrar la empresa"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    empresa,
    logoPreview,
    fileInputRef,
    loading,
    mensaje,
    fieldErrors,
    handleChange,
    handleLogoSelect,
    handleSubmit,
  };
};