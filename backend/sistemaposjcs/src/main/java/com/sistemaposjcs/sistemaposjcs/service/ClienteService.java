package com.sistemaposjcs.sistemaposjcs.service;

import com.sistemaposjcs.sistemaposjcs.model.Cliente;
import com.sistemaposjcs.sistemaposjcs.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClienteService {
    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }
    
    // ✅ Obtener usuario por ID
    public Cliente getClienteById(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    // ✅ Listar todos los usuarios
    public List<Cliente> getAllInactiveClientes() {
        return clienteRepository.findAll();
    }

    
    public List<Cliente> getAllActiveClientes() {
    return clienteRepository.findByEstadoTrue();
    }


    // ✅ Crear cliente
    public Cliente createCliente(Cliente cliente) {
        return clienteRepository.save(cliente);
    }


    // ✅ Actualizar cliente
    public Cliente updateCliente(Long id, Cliente clienteDetails) {
        Cliente cliente = getClienteById(id);

        cliente.setNombre(clienteDetails.getNombre());
        cliente.setApellido(clienteDetails.getApellido());
        cliente.setDocumento(clienteDetails.getDocumento());
        cliente.setEmail(clienteDetails.getEmail());
        cliente.setTelefono(clienteDetails.getTelefono());

        return clienteRepository.save(cliente);
    }


    public void desactivarCliente(Long id) {
        Cliente u = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        u.setEstado(false);    // 🔥 Inactiva
        clienteRepository.save(u);
    }

    public Cliente activarCliente(Long id) {
    Cliente u = clienteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

    u.setEstado(true);     // 🔥 Activa
    return clienteRepository.save(u);
}

    
}
