package com.sistemaposjcs.sistemaposjcs.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.groups.Default;
import lombok.*;
import jakarta.validation.constraints.Pattern;
import com.sistemaposjcs.sistemaposjcs.model.Enum.TipoDocumento;

@Entity
@Table(
    name = "usuarios",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_username", columnNames = "username"),
        @UniqueConstraint(name = "uk_documento", columnNames = "documento"),
        @UniqueConstraint(name = "uk_email", columnNames = "email")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    // 🔹 Grupos de validación
    public interface OnCreate extends Default {}
    public interface OnUpdate extends Default {}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @NotBlank(message = "El username de usuario es obligatorio")
    @Column(nullable = false, unique = true)
    private String username;

    // 🔹 Solo obligatorio al CREAR
    @NotBlank(message = "La contraseña es obligatoria", groups = OnCreate.class)
    @Size(min = 4, message = "La contraseña debe tener al menos 4 caracteres", groups = OnCreate.class)
    @Column(nullable = false)
    private String password;

    @NotBlank(message = "El primer nombre es obligatorio")
    @Pattern(
        regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$",
        message = "El primer nombre solo puede contener letras"
    )
    @Column(nullable = false)
    private String primerNombre;

    @Pattern(
        regexp = "^$|^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$",
        message = "El segundo nombre solo puede contener letras"
    )
    @Column(nullable = true)
    private String segundoNombre;

    @NotBlank(message = "El primer apellido es obligatorio")
    @Pattern(
        regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$",
        message = "El apellido solo puede contener letras"
    )
    @Column(nullable = false)
    private String primerApellido;
    
    @Pattern(
        regexp = "^$|^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$",
        message = "El segundo apellido solo puede contener letras"
    )
    @Column(nullable = true)
    private String segundoApellido;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoDocumento tipoDocumento;


    @NotBlank(message = "El documento es obligatorio")
    @Pattern(
        regexp = "^[0-9]{6,12}$",
        message = "El documento debe contener solo números (6 a 12 dígitos)"
    )
    @Column(nullable = false, unique = true)
    private String documento;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol;

    @Email(message = "El correo no tiene un formato válido")
    @Column(unique = true)
    private String email;

    @Size(max = 15, message = "El teléfono no debe tener más de 15 caracteres")
    @Column(length = 15)
    private String telefono;

    private Boolean estado = true;

    public String getNombreCompleto(){

        String nombre = primerNombre;

        if(segundoNombre != null && !segundoNombre.isEmpty()){
            nombre += " " + segundoNombre;
        }

        nombre += " " + primerApellido;

        if(segundoApellido != null && !segundoApellido.isEmpty()){
            nombre += " " + segundoApellido;
        }

        return nombre;
    }
}




