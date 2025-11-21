package com.sistemaposjcs.sistemaposjcs.service;

import com.sistemaposjcs.sistemaposjcs.model.Cliente;
import com.sistemaposjcs.sistemaposjcs.repository.ClienteRepository;

import jakarta.validation.Validator;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Set;


@Service
public class ClienteService {
    private final ClienteRepository clienteRepository;

    @Autowired
    private Validator validator;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }
    
    // ✅ Obtener usuario por ID
    public Cliente getClienteById(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    // ✅ Listar todos los usuarios
    public List<Cliente> getInactiveClientes() {
        return clienteRepository.findByEstadoFalse();
    }

    
    public List<Cliente> getActiveClientes() {
    return clienteRepository.findByEstadoTrue();
    }


    // ✅ Crear cliente
    public Cliente createCliente(Cliente cliente) {
        return clienteRepository.save(cliente);
    }


    // ✅ Actualizar cliente
    public Cliente updateCliente(Long id, Cliente data) {
                Cliente c = getClienteById(id);

        // Tipo Cliente
        c.setTipoCliente(data.getTipoCliente());

        // ====================
        // PERSONA NATURAL
        // ====================
        c.setPrimerNombre(data.getPrimerNombre());
        c.setSegundoNombre(data.getSegundoNombre());
        c.setPrimerApellido(data.getPrimerApellido());
        c.setSegundoApellido(data.getSegundoApellido());

        // ====================
        // EMPRESA
        // ====================
        c.setRazonSocial(data.getRazonSocial());
        c.setIdentificadorNit(data.getIdentificadorNit());

        // ====================
        // COMUNES
        // ====================
        c.setTipoDocumento(data.getTipoDocumento());
        c.setDocumento(data.getDocumento());
        c.setEmail(data.getEmail());
        c.setTelefono(data.getTelefono());
        c.setDireccion(data.getDireccion());

        // 🔥 Validar nuevamente entidad completa
        Set<ConstraintViolation<Cliente>> violations = validator.validate(c);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        return clienteRepository.save(c);
    }


    public void desactivarCliente(Long id) {
        Cliente c = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        c.setEstado(false);    // 🔥 Inactiva
        clienteRepository.save(c);
    }

    public Cliente activarCliente(Long id) {
    Cliente c = clienteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

    c.setEstado(true);     // 🔥 Activa
    return clienteRepository.save(c);
}
 
}
