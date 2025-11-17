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

  nombre: yup
    .string()
    .required("El nombre es obligatorio")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, "El nombre solo puede contener letras y espacios"),

  apellido: yup
    .string()
    .required("El apellido es obligatorio")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, "El apellido solo puede contener letras y espacios"),

  documento: yup
    .string()
    .required("El documento es obligatorio")
    .matches(/^[0-9]{6,12}$/, "El documento debe tener entre 6 y 12 dígitos numéricos"),

  role: yup
    .string()
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
