package com.sistemaposjcs.sistemaposjcs.model;

import com.sistemaposjcs.sistemaposjcs.model.Enum.TipoCliente;
import com.sistemaposjcs.sistemaposjcs.model.Enum.TipoDocumento;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import jakarta.validation.constraints.Pattern;
import com.sistemaposjcs.sistemaposjcs.validation.ValidCliente;

@ValidCliente
@Entity
@Table(name = "clientes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Long idCliente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoCliente tipoCliente;

    // ======================
    //    PERSONA NATURAL
    // ======================

    @Pattern(regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$", message = "El primer nombre solo puede contener letras")
    @Column(nullable = true)
    private String primerNombre;

    @Pattern(regexp = "^$|^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$", message = "El segundo nombre solo puede contener letras")
    @Column(nullable = true)
    private String segundoNombre;

    @Pattern(regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$", message = "El primer apellido solo puede contener letras")
    @Column(nullable = true)
    private String primerApellido;

    @Pattern(regexp = "^$|^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$", message = "El segundo apellido solo puede contener letras")
    @Column(nullable = true)
    private String segundoApellido;

    // ======================
    //        EMPRESA
    // ======================
    
    @Pattern(regexp = "^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ .,&-]+$", message = "La razón social contiene caracteres inválidos")
    @Column(nullable = true)
    private String razonSocial;

    @Pattern(regexp = "^[0-9]$", message = "El DV del NIT debe ser un solo dígito")
    @Column(nullable = true, unique = true)
    private String identificadorNit;

    // ======================
    //         COMÚNES
    // ======================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoDocumento tipoDocumento;

    @NotBlank(message = "El documento es obligatorio")
    @Pattern(regexp = "^[0-9]{6,12}$", message = "El documento debe contener solo números (6 a 12 dígitos)")
    @Column(nullable = false, unique = true)
    private String documento;

    @Email(message = "El correo no tiene un formato válido")
    @Column(nullable = false)
    private String email;

    @Size(max = 15, message = "El teléfono no debe tener más de 15 caracteres")
    @Column(length = 15)
    private String telefono;

    private String direccion;

    private Boolean estado = true;
}

