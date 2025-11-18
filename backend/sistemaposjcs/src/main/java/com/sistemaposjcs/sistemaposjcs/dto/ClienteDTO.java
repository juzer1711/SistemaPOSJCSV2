package com.sistemaposjcs.sistemaposjcs.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor
public class ClienteDTO {
    private Long idCliente;
    private String nombre;
    private String apellido;
    private String documento;
    private String email;
    private String telefono;
    private Boolean estado;
}
