package com.sistemaposjcs.sistemaposjcs.service;

import com.sistemaposjcs.sistemaposjcs.model.Cliente;
import com.sistemaposjcs.sistemaposjcs.repository.ClienteRepository;

import jakarta.validation.Validator;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;

import java.util.List;
import java.util.ArrayList;
import java.util.Set;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    @Autowired
    private Validator validator;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    // Obtener cliente por ID
    public Cliente getClienteById(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    // Paginación activos
    public Page<Cliente> getActiveClientes(Pageable pageable) {
        return clienteRepository.findByEstadoTrue(pageable);
    }

    public Page<Cliente> getInactiveClientes(Pageable pageable) {
        return clienteRepository.findByEstadoFalse(pageable);
    }

    public Cliente createCliente(Cliente cliente) {
        if (cliente.getEstado() == null) {
            cliente.setEstado(true);
        }
        return clienteRepository.save(cliente);
    }

    // Actualizar cliente
    public Cliente updateCliente(Long id, Cliente data) {
        Cliente c = getClienteById(id);

        c.setTipoCliente(data.getTipoCliente());

        c.setPrimerNombre(data.getPrimerNombre());
        c.setSegundoNombre(data.getSegundoNombre());
        c.setPrimerApellido(data.getPrimerApellido());
        c.setSegundoApellido(data.getSegundoApellido());

        c.setRazonSocial(data.getRazonSocial());
        c.setIdentificadorNit(data.getIdentificadorNit());

        c.setTipoDocumento(data.getTipoDocumento());
        c.setDocumento(data.getDocumento());
        c.setEmail(data.getEmail());
        c.setTelefono(data.getTelefono());
        c.setDireccion(data.getDireccion());

        Set<ConstraintViolation<Cliente>> violations = validator.validate(c);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        return clienteRepository.save(c);
    }

    public void desactivarCliente(Long id) {
        Cliente c = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        c.setEstado(false);
        clienteRepository.save(c);
    }

    public Cliente activarCliente(Long id) {
        Cliente c = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        c.setEstado(true);
        return clienteRepository.save(c);
    }

    public Page<Cliente> searchClientes(
        Pageable pageable,
        String search,
        String tipoCliente,
        String tipoDocumento,
        Boolean estado
    ) {
        Specification<Cliente> spec = buildSpec(search, tipoCliente, tipoDocumento, estado);
        return clienteRepository.findAll(spec, pageable);
    }

    public Specification<Cliente> buildSpec(
        String search,
        String tipoCliente,
        String tipoDocumento,
        Boolean estado
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // búsqueda global
            if (search != null && !search.isEmpty()) {
                String like = "%" + search.toLowerCase() + "%";

                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("primerNombre")), like),
                    cb.like(cb.lower(root.get("segundoNombre")), like),
                    cb.like(cb.lower(root.get("primerApellido")), like),
                    cb.like(cb.lower(root.get("segundoApellido")), like),
                    cb.like(cb.lower(root.get("razonSocial")), like),
                    cb.like(cb.lower(root.get("documento")), like)
                ));
            }

            // tipo cliente
            if (tipoCliente != null && !tipoCliente.isEmpty()) {
                predicates.add(cb.equal(root.get("tipoCliente"), tipoCliente));
            }

            // tipo documento
            if (tipoDocumento != null && !tipoDocumento.isEmpty()) {
                predicates.add(cb.equal(root.get("tipoDocumento"), tipoDocumento));
            }

            // estado
            if (estado != null) {
                predicates.add(cb.equal(root.get("estado"), estado));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
