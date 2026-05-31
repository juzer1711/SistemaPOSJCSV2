package com.sistemaposjcs.sistemaposjcs.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmpresaDTO {

    private Long idEmpresa;

    private String nombreComercial;

    private String razonSocial;

    private String nit;

    private String direccion;

    private String telefono;

    private String correo;

    private String logo;

    private Boolean estado;
}