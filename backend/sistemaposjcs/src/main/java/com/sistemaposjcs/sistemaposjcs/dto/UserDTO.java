package com.sistemaposjcs.sistemaposjcs.dto;

import com.sistemaposjcs.sistemaposjcs.model.Rol;
import com.sistemaposjcs.sistemaposjcs.model.Enum.TipoDocumento;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor
public class UserDTO {
    private Long idUsuario;
    private String username;
    private String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;
    private TipoDocumento tipoDocumento;
    private String documento;
    private Rol rol;
    private String email;
    private String telefono;
    private Boolean estado;
}
