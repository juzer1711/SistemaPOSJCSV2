package com.sistemaposjcs.sistemaposjcs.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(
    name = "clientes"
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Long idCliente;

    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Pattern(
        regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$",
        message = "El nombre solo puede contener letras y espacios"
    )
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Pattern(
        regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$",
        message = "El apellido solo puede contener letras y espacios"
    )
    @Column(nullable = false)
    private String apellido;

    @NotBlank(message = "El documento es obligatorio")
    @Pattern(
        regexp = "^[0-9]{6,12}$",
        message = "El documento debe contener solo números (6 a 12 dígitos)"
    )
    @Column(nullable = false, unique = true)
    private String documento;


    @Email(message = "El correo no tiene un formato válido")
    @Column(nullable = false)
    private String email;

    @Size(max = 15, message = "El teléfono no debe tener más de 15 caracteres")
    @Column(length = 15)
    private String telefono;

    private Boolean estado = true;
}
