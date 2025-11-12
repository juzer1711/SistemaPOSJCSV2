package com.sistemaposjcs.sistemaposjcs.dto;

import com.sistemaposjcs.sistemaposjcs.model.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor
public class UserDTO {
    private Long idUsuario;
    private String username;
    private String nombre;
    private String apellido;
    private String documento;
    private Role role;
    private String email;
    private String telefono;
}
