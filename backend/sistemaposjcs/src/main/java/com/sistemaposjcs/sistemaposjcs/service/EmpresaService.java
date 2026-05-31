package com.sistemaposjcs.sistemaposjcs.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.sistemaposjcs.sistemaposjcs.dto.EmpresaDTO;
import com.sistemaposjcs.sistemaposjcs.model.Empresa;
import com.sistemaposjcs.sistemaposjcs.repository.EmpresaRepository;


import java.util.Map;
import com.cloudinary.utils.ObjectUtils;

import java.io.IOException;

import lombok.RequiredArgsConstructor;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;


@Service
@RequiredArgsConstructor
public class EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final Cloudinary cloudinary;

    public EmpresaDTO obtenerEmpresa() {
        return empresaRepository
                .findFirstByEstadoTrue()
                .map(this::convertirADTO)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "No existe una empresa registrada"
                ));
    }

    public EmpresaDTO crearEmpresa(Empresa empresa) {
        if (empresaRepository.count() > 0) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Ya existe una empresa registrada en el sistema"
            );
        }
        empresa.setEstado(true);
        return convertirADTO(empresaRepository.save(empresa));
    }

    public EmpresaDTO actualizarEmpresa(Long id, Empresa datosActualizados) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Empresa no encontrada"
                ));

        empresa.setNombreComercial(datosActualizados.getNombreComercial());
        empresa.setRazonSocial(datosActualizados.getRazonSocial());
        empresa.setNit(datosActualizados.getNit());
        empresa.setDireccion(datosActualizados.getDireccion());
        empresa.setTelefono(datosActualizados.getTelefono());
        empresa.setCorreo(datosActualizados.getCorreo());
        empresa.setLogo(datosActualizados.getLogo());

        return convertirADTO(empresaRepository.save(empresa));
    }

    public EmpresaDTO actualizarLogo(MultipartFile file) throws IOException {
        Empresa empresa = empresaRepository
                .findFirstByEstadoTrue()
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "No existe una empresa registrada"
                ));

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "El archivo debe ser una imagen"
            );
        }

        if (empresa.getLogo() != null) {
            cloudinary.uploader().destroy(
                "pos_system/empresa_logos/" + empresa.getIdEmpresa(),
                ObjectUtils.emptyMap()
            );
        }

        @SuppressWarnings("unchecked")
        Map<Object, Object> uploadResult = cloudinary.uploader().upload(
            file.getBytes(),
            ObjectUtils.asMap(
                "public_id", "empresa_logos/" + empresa.getIdEmpresa(),
                "overwrite", true,
                "folder",    "pos_system"
            )
        );

        empresa.setLogo((String) uploadResult.get("secure_url"));
        empresaRepository.save(empresa);

        return convertirADTO(empresa);
    }

    private EmpresaDTO convertirADTO(Empresa empresa) {
        return new EmpresaDTO(
                empresa.getIdEmpresa(),
                empresa.getNombreComercial(),
                empresa.getRazonSocial(),
                empresa.getNit(),
                empresa.getDireccion(),
                empresa.getTelefono(),
                empresa.getCorreo(),
                empresa.getLogo(),
                empresa.getEstado());
    }
}