import * as yup from "yup";

export const userSchema = yup.object().shape({
  username: yup
    .string()
    .required("El nombre de usuario es obligatorio")
    .min(3, "El usuario debe tener al menos 3 caracteres"),

  password: yup
    .string()
    .when("$isEditing", {
      is: false, // solo obligatorio al crear
      then: (schema) =>
        schema
          .required("La contraseña es obligatoria")
          .min(6, "Debe tener al menos 6 caracteres"),
      otherwise: (schema) => schema.notRequired(),
    }),

  primerNombre: yup
    .string()
    .required("El primer nombre es obligatorio")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, "El nombre solo puede contener letras"),

  segundoNombre: yup
    .string()
    .nullable() 
    .notRequired()
    .matches(/^$|^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, "El segundo nombre solo puede contener letras"),

  primerApellido: yup
    .string()
    .required("El primer apellido es obligatorio")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, "El primer apellido solo puede contener letras"),
  
  segundoApellido: yup
    .string()
    .nullable() 
    .notRequired()
    .matches(/^$|^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, "El segundo apellido solo puede contener letras"),

  tipoDocumento: yup
    .string()
    .oneOf(["CEDULA_CIUDADANIA", "CEDULA_EXTRANJERIA", "TARJETA_EXTRANJERIA", "PASAPORTE", "NIT"], "Tipo de documento inválido")
    .required("El tipo de documento es obligatorio"),

  documento: yup
    .string()
    .required("El documento es obligatorio")
    .matches(/^[0-9]{6,12}$/, "El documento debe tener entre 6 y 12 dígitos numéricos"),

  rolId: yup
    .number()
    .oneOf([1, 2, 3], "Rol inválido")
    .required("El rol es obligatorio"),


  email: yup
    .string()
    .email("El correo no es válido")
    .required("El correo es obligatorio"),

  telefono: yup
    .string()
    .required("El teléfono es obligatorio")
    .matches(/^[0-9]{7,10}$/, "El teléfono debe tener entre 7 y 10 dígitos"),
});

export const productSchema = yup.object().shape({
  nombre: yup
    .string()
    .required("El nombre del producto es obligatorio"),

  categoria: yup
    .string()
    .required("La categoría es obligatoria"),

  costo: yup
    .number()
    .typeError("El costo debe ser un número")
    .positive("El costo debe ser mayor a 0")
    .required("El costo es obligatorio"),

  precioventa: yup
    .number()
    .typeError("El precio de venta debe ser un número")
    .positive("El precio debe ser mayor a 0")
    .required("El precio de venta es obligatorio"),

  estado: yup
    .string()
    .oneOf(["ACTIVO", "INACTIVO"])
    .required("El estado es obligatorio"),
});

export const clientSchema = yup.object().shape({
  tipoCliente: yup
    .string()
    .oneOf(["PERSONA_NATURAL", "EMPRESA"], "Tipo de cliente no válido")
    .required("El tipo de cliente es obligatorio"),

  // ===========================
  // PERSONA NATURAL
  // ===========================
  primerNombre: yup.string().when("tipoCliente", {
    is: "PERSONA_NATURAL",
    then: (schema) =>
      schema
        .required("El primer nombre es obligatorio")
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, "Solo se permiten letras y espacios"),
    otherwise: (schema) => schema.strip(), // elimina el campo si no aplica
  }),

  segundoNombre: yup.string()
  .nullable() 
  .notRequired()
  .when("tipoCliente", {
    is: "PERSONA_NATURAL",
    then: (schema) =>
      schema.matches(/^$|^[A-Za-zÁÉÍÓÚáéíóúÑñ ]*$/, "Solo se permiten letras y espacios"),
    otherwise: (schema) => schema.strip(),
  }),

  primerApellido: yup.string().when("tipoCliente", {
    is: "PERSONA_NATURAL",
    then: (schema) =>
      schema
        .required("El primer apellido es obligatorio")
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, "Solo se permiten letras y espacios"),
    otherwise: (schema) => schema.strip(),
  }),

  segundoApellido: yup.string()
  .nullable() 
  .notRequired()
  .when("tipoCliente", {
    is: "PERSONA_NATURAL",
    then: (schema) =>
      schema.matches(/^$|^[A-Za-zÁÉÍÓÚáéíóúÑñ ]*$/, "Solo se permiten letras y espacios"),
    otherwise: (schema) => schema.strip(),
  }),

  tipoDocumento: yup.string().when("tipoCliente", {
    is: "PERSONA_NATURAL",
    then: (schema) =>
    schema.oneOf(["CEDULA_CIUDADANIA", "CEDULA_EXTRANJERIA","TARJETA_EXTRANJERIA","PASAPORTE","PEP"], "Tipo de documento no válido")
    .required("El tipo de documento es obligatorio"),
    }),

  // ===========================
  // EMPRESA
  // ===========================
  razonSocial: yup.string().when("tipoCliente", {
    is: "EMPRESA",
    then: (schema) =>
      schema.required("La razón social es obligatoria"),
    otherwise: (schema) => schema.strip(),
  }),

  identificadorNit: yup.string().when("tipoCliente", {
    is: "EMPRESA",
    then: (schema) =>
      schema
        .required("El dígito verificador del NIT es obligatorio")
        .matches(/^[0-9]{1}$/, "Debe ser un dígito entre 0 y 9"),
    otherwise: (schema) => schema.strip(),
  }),

  tipoDocumento: yup.string().when("tipoCliente", {
    is: "EMPRESA",
    then: (schema) =>
    schema.oneOf(["NIT"], "Tipo de documento no válido")
    .required("El tipo de documento es obligatorio"),
    }),

  // ===========================
  // CAMPOS COMUNES
  // ===========================

  documento: yup
      .string()
      .required("El documento es obligatorio")
      .matches(/^[0-9]{6,12}$/, "El documento debe tener entre 6 y 12 dígitos numéricos"),

  email: yup
    .string()
    .email("El correo no es válido")
    .required("El correo es obligatorio"),

  telefono: yup
    .string()
    .required("El teléfono es obligatorio")
    .matches(/^[0-9]{7,10}$/, "Debe tener entre 7 y 10 dígitos"),
});

