package com.sistemaposjcs.sistemaposjcs.service;

import com.sistemaposjcs.sistemaposjcs.dto.AuditoriaDTO;
import com.sistemaposjcs.sistemaposjcs.dto.UsuarioAuditoriaDTO;
import com.sistemaposjcs.sistemaposjcs.model.Auditoria;
import com.sistemaposjcs.sistemaposjcs.model.Usuario;
import com.sistemaposjcs.sistemaposjcs.repository.AuditoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;

import java.util.List;

@Service
public class AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;

    public AuditoriaService(AuditoriaRepository auditoriaRepository) {
        this.auditoriaRepository = auditoriaRepository;
    }

    // ✅ REGISTRAR AUDITORIA
    public void registrar(Usuario usuario, String modulo, String accion, String descripcion) {

        if (usuario == null) {
            throw new RuntimeException("Usuario no puede ser null en auditoría");
        }

        Auditoria auditoria = new Auditoria();
        auditoria.setUsuario(usuario);
        auditoria.setModulo(modulo);
        auditoria.setAccion(accion);
        auditoria.setDescripcion(descripcion);

        auditoriaRepository.save(auditoria);
    }

    // ✅ LISTAR DTO (seguro)
    public List<AuditoriaDTO> listar() {
        return auditoriaRepository.findAll(Sort.by(Sort.Direction.DESC, "id"))
                .stream()
                .map(this::toDTO)
                .toList();
    }

    private AuditoriaDTO toDTO(Auditoria auditoria) {

        Usuario usuario = auditoria.getUsuario();

        UsuarioAuditoriaDTO usuarioDTO = new UsuarioAuditoriaDTO(
                usuario.getIdUsuario(),
                usuario.getUsername(),
                usuario.getNombreCompleto()
        );

        return new AuditoriaDTO(
                auditoria.getId(),
                auditoria.getFecha(),
                usuarioDTO,
                auditoria.getModulo(),
                auditoria.getAccion(),
                auditoria.getDescripcion()
        );
    }
}