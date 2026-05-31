package com.sistemaposjcs.sistemaposjcs.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(
    name = "empresa",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_empresa_nit", columnNames = "nit")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empresa")
    private Long idEmpresa;

    @NotBlank(message = "El nombre comercial es obligatorio")
    @Size(max = 150, message = "El nombre comercial no puede superar 150 caracteres")
    @Column(nullable = false)
    private String nombreComercial;

    @NotBlank(message = "La razón social es obligatoria")
    @Size(max = 150, message = "La razón social no puede superar 150 caracteres")
    @Column(nullable = false)
    private String razonSocial;

    @NotBlank(message = "El NIT es obligatorio")
    @Pattern(
        regexp = "^[0-9\\-]{5,20}$",
        message = "El NIT solo puede contener números y guiones"
    )
    @Column(nullable = false, unique = true)
    private String nit;

    @NotBlank(message = "La dirección es obligatoria")
    @Size(max = 255)
    @Column(nullable = false)
    private String direccion;

    @NotBlank(message = "El teléfono es obligatorio")
    @Size(max = 15)
    @Column(nullable = false)
    private String telefono;

    @Email(message = "El correo no tiene un formato válido")
    @Column(length = 150)
    private String correo;

    /**
     * URL o nombre del archivo
     * cuando implementes carga de imágenes.
     */
    @Column(length = 255)
    private String logo;

    private Boolean estado = true;
}