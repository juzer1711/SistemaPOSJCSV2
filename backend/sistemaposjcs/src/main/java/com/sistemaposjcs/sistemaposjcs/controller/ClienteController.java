package com.sistemaposjcs.sistemaposjcs.controller;

import com.sistemaposjcs.sistemaposjcs.dto.ClienteDTO;
import com.sistemaposjcs.sistemaposjcs.model.Cliente;
import com.sistemaposjcs.sistemaposjcs.service.ClienteService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "http://localhost:3000") // permitir conexión desde React

public class ClienteController {

private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    // ✅ 1. Listar solo usuarios ACTIVOS
@GetMapping
public List<ClienteDTO> getActiveClientes() {
    return clienteService.getActiveClientes()
        .stream()
        .map(c -> new ClienteDTO(
            c.getIdCliente(),
            c.getTipoCliente(),
            c.getPrimerNombre(),
            c.getSegundoNombre(),
            c.getPrimerApellido(),
            c.getSegundoApellido(),
            c.getRazonSocial(),
            c.getIdentificadorNit(),
            c.getTipoDocumento(),
            c.getDocumento(),
            c.getEmail(),
            c.getTelefono(),
            c.getDireccion(),
            c.getEstado()))
        .toList();
}

    @GetMapping("/inactivos")
public List<ClienteDTO> getInactiveClientes() {
    return clienteService.getInactiveClientes()
        .stream()
        .filter(u -> u.getEstado() == false)
        .map(c -> new ClienteDTO(
            c.getIdCliente(),
            c.getTipoCliente(),
            c.getPrimerNombre(),
            c.getSegundoNombre(),
            c.getPrimerApellido(),
            c.getSegundoApellido(),
            c.getRazonSocial(),
            c.getIdentificadorNit(),
            c.getTipoDocumento(),
            c.getDocumento(),
            c.getEmail(),
            c.getTelefono(),
            c.getDireccion(),
            c.getEstado()))
        .toList();
}

    //  Obtener cliente por ID
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> getClienteById(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.getClienteById(id));
    }

        //  Crear cliente
    @PostMapping
    public ResponseEntity<Cliente> createCliente(@Valid @RequestBody Cliente cliente) {
        return ResponseEntity.ok(clienteService.createCliente(cliente));
    }

    //  Actualizar cliente
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> updateCliente(
            @PathVariable Long id,
            @Valid @RequestBody Cliente cliente
    ) {
        return ResponseEntity.ok(clienteService.updateCliente(id, cliente));
    }

    // ✅ 5. Desactivar cliente
    @DeleteMapping("/desactivar/{id}")
    public ResponseEntity<Void> desactivarCliente(@PathVariable Long id) {
        clienteService.desactivarCliente(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/activar/{id}")
    public ResponseEntity<Cliente> activarCliente(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.activarCliente(id));
    }
}
    

