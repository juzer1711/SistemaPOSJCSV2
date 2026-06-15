package com.sistemaposjcs.sistemaposjcs.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.sistemaposjcs.sistemaposjcs.dto.EmpresaDTO;
import com.sistemaposjcs.sistemaposjcs.model.Empresa;
import com.sistemaposjcs.sistemaposjcs.model.Usuario;
import com.sistemaposjcs.sistemaposjcs.repository.EmpresaRepository;
import com.sistemaposjcs.sistemaposjcs.seguridad.UsuarioAuthService;

import java.util.ArrayList;
import java.util.List;
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
    private final AuditoriaService auditoriaService;
    private final UsuarioAuthService usuarioAuthService;

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

        Empresa empresaCreada = empresaRepository.save(empresa);

        try {

            Usuario administrador = usuarioAuthService.getUsuarioLogueado();

            String descripcion =
                    "Empresa creada.\n" +
                    "Nombre comercial: " + empresaCreada.getNombreComercial() + ".\n" +
                    "NIT: " + empresaCreada.getNit() + ".";

            auditoriaService.registrar(
                    administrador,
                    "EMPRESA",
                    "CREAR",
                    descripcion
            );

        } catch (Exception e) {
            System.out.println("Error auditoría empresa: " + e.getMessage());
        }

        return convertirADTO(empresaCreada);
    }

    public EmpresaDTO actualizarEmpresa(Long id, Empresa datosActualizados) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Empresa no encontrada"
                ));

        // ===== Valores anteriores =====
        String nombreAnterior = empresa.getNombreComercial();
        String razonAnterior = empresa.getRazonSocial();
        String nitAnterior = empresa.getNit();
        String direccionAnterior = empresa.getDireccion();
        String telefonoAnterior = empresa.getTelefono();
        String correoAnterior = empresa.getCorreo();

        // ===== Actualizar datos =====
        empresa.setNombreComercial(datosActualizados.getNombreComercial());
        empresa.setRazonSocial(datosActualizados.getRazonSocial());
        empresa.setNit(datosActualizados.getNit());
        empresa.setDireccion(datosActualizados.getDireccion());
        empresa.setTelefono(datosActualizados.getTelefono());
        empresa.setCorreo(datosActualizados.getCorreo());
        empresa.setLogo(datosActualizados.getLogo());

        Empresa empresaActualizada = empresaRepository.save(empresa);

        try {

            Usuario administrador = usuarioAuthService.getUsuarioLogueado();

            List<String> cambios = new ArrayList<>();

            if (!java.util.Objects.equals(nombreAnterior, empresaActualizada.getNombreComercial())) {
                cambios.add("Nombre comercial: '" + nombreAnterior + "' → '" + empresaActualizada.getNombreComercial() + "'");
            }

            if (!java.util.Objects.equals(razonAnterior, empresaActualizada.getRazonSocial())) {
                cambios.add("Razón social: '" + razonAnterior + "' → '" + empresaActualizada.getRazonSocial() + "'");
            }

            if (!java.util.Objects.equals(nitAnterior, empresaActualizada.getNit())) {
                cambios.add("NIT: '" + nitAnterior + "' → '" + empresaActualizada.getNit() + "'");
            }

            if (!java.util.Objects.equals(direccionAnterior, empresaActualizada.getDireccion())) {
                cambios.add("Dirección: '" + direccionAnterior + "' → '" + empresaActualizada.getDireccion() + "'");
            }

            if (!java.util.Objects.equals(telefonoAnterior, empresaActualizada.getTelefono())) {
                cambios.add("Teléfono: '" + telefonoAnterior + "' → '" + empresaActualizada.getTelefono() + "'");
            }

            if (!java.util.Objects.equals(correoAnterior, empresaActualizada.getCorreo())) {
                cambios.add("Correo: '" + correoAnterior + "' → '" + empresaActualizada.getCorreo() + "'");
            }

            if (!cambios.isEmpty()) {

                auditoriaService.registrar(
                        administrador,
                        "EMPRESA",
                        "ACTUALIZAR",
                        "Empresa actualizada.\n" + String.join("\n", cambios)
                );

            }

        } catch (Exception e) {
            System.out.println("Error auditoría empresa: " + e.getMessage());
        }

        return convertirADTO(empresaActualizada);
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
        Empresa empresaActualizada = empresaRepository.save(empresa);

        try {

            Usuario administrador = usuarioAuthService.getUsuarioLogueado();

            auditoriaService.registrar(
                    administrador,
                    "EMPRESA",
                    "ACTUALIZAR LOGO",
                    "Se actualizó el logo de la empresa."
            );

        } catch (Exception e) {
            System.out.println("Error auditoría empresa: " + e.getMessage());
        }

        return convertirADTO(empresaActualizada);
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