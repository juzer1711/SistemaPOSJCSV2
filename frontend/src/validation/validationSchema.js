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

  rolId: yup
    .number()
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
