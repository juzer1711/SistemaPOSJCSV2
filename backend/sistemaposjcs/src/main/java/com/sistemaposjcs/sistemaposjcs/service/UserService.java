package com.sistemaposjcs.sistemaposjcs.service;

import com.sistemaposjcs.sistemaposjcs.model.Usuario;
import com.sistemaposjcs.sistemaposjcs.model.Enum.TipoDocumento;
import com.sistemaposjcs.sistemaposjcs.model.Rol;
import com.sistemaposjcs.sistemaposjcs.repository.RolRepository;
import com.sistemaposjcs.sistemaposjcs.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.ArrayList;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Expression;
import java.util.List;
import jakarta.persistence.criteria.Predicate;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RolRepository rolRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository , RolRepository rolRepository) {
        this.userRepository = userRepository;
        this.rolRepository = rolRepository;
    }

    // ✅ Obtener usuario por ID
    public Usuario getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    // ✅ Listar todos los usuarios inactivos
    public Page<Usuario> getInactiveUsers(Pageable pageable) {
        return userRepository.findByEstadoFalse(pageable);
    }

    public Page<Usuario> getActiveUsers(Pageable pageable) {
        return userRepository.findByEstadoTrue(pageable);
    }

    // ✅ Crear usuario
    public Usuario createUser(Usuario usuario) {

        // 🔥 Reemplazar rol recibido con el rol REAL de la BD
        if (usuario.getRol() != null && usuario.getRol().getId() != null) {
            Rol rolReal = rolRepository.findById(usuario.getRol().getId())
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
            usuario.setRol(rolReal);
        }

        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        return userRepository.save(usuario);
    }


    // ✅ Actualizar usuario
    public Usuario updateUser(Long id, Usuario userDetails) {
        Usuario usuario = getUserById(id);

        usuario.setUsername(userDetails.getUsername());
        usuario.setPrimerNombre(userDetails.getPrimerNombre());
        usuario.setSegundoNombre(userDetails.getSegundoNombre());
        usuario.setPrimerApellido(userDetails.getPrimerApellido());
        usuario.setSegundoApellido(userDetails.getSegundoApellido());
        usuario.setTipoDocumento(userDetails.getTipoDocumento());
        usuario.setDocumento(userDetails.getDocumento());
        usuario.setEmail(userDetails.getEmail());
        usuario.setTelefono(userDetails.getTelefono());

        // 🔥 Si viene un rol en el JSON, lo asignamos correctamente
        if (userDetails.getRol() != null && userDetails.getRol().getId() != null) {
            Rol nuevoRol = rolRepository.findById(userDetails.getRol().getId())
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
            usuario.setRol(nuevoRol);
        }

        // 🔥 Solo cambiamos contraseña si fue enviada
        if (userDetails.getPassword() != null && !userDetails.getPassword().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        return userRepository.save(usuario);
    }


    public void desactivarUsuario(Long id) {
        Usuario u = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        u.setEstado(false);    // 🔥 Inactiva
        userRepository.save(u);
    }

    public Usuario activarUsuario(Long id) {
    Usuario u = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    u.setEstado(true);     // 🔥 Activa
    return userRepository.save(u);
    }

    public Page<Usuario> searchUsuarios(
        Pageable pageable,
        String search,
        String rol,
        Boolean estado,
        TipoDocumento tipoDocumento,
        String documento
    ) {
        Specification<Usuario> spec = buildSpec(search, rol, estado, tipoDocumento, documento);
        return userRepository.findAll(spec, pageable);
    }

    public Specification<Usuario> buildSpec(
        String search,
        String rol,
        Boolean estado,
        TipoDocumento tipoDocumento,
        String documento
    ) {
        return (root, query, cb) -> {
                List<Predicate> predicates = new ArrayList<>();

                // 🔍 búsqueda global (nombre o email)
                if (search != null && !search.isEmpty()) {
                    String searchLower = "%" + search.toLowerCase() + "%";

                    Expression<String> nombreCompletoUsuario = cb.concat(cb.lower(root.get("primerNombre")), " ");
                    nombreCompletoUsuario = cb.concat(nombreCompletoUsuario, cb.lower(cb.coalesce(root.get("segundoNombre"), "")));
                    nombreCompletoUsuario = cb.concat(nombreCompletoUsuario, " ");
                    nombreCompletoUsuario = cb.concat(nombreCompletoUsuario, cb.lower(root.get("primerApellido")));
                    nombreCompletoUsuario = cb.concat(nombreCompletoUsuario, " ");
                    nombreCompletoUsuario = cb.concat(nombreCompletoUsuario, cb.lower(root.get("segundoApellido")));
                        predicates.add(cb.or(
                            cb.like(nombreCompletoUsuario, searchLower),
                            cb.like(cb.lower(root.get("email")), "%" + search.toLowerCase() + "%"),
                            cb.like(cb.lower(root.get("username")), "%" + search.toLowerCase() + "%"),
                            cb.like(cb.lower(root.get("documento")), "%" + search.toLowerCase() + "%")
                        ));
                    }

                // 🎭 rol
                // 🎭 Filtro por Rol (Entidad)
                if (rol != null) {
                    // Hacemos el JOIN con la tabla de roles y filtramos por su ID
                    predicates.add(cb.equal(root.join("rol").get("nombre"), rol));
                }

                // 🟢 estado
                if (estado != null) {
                    predicates.add(cb.equal(root.get("estado"), estado));
                }

                // 📄 tipo documento
                if (tipoDocumento != null) {
                    predicates.add(cb.equal(root.get("tipoDocumento"), tipoDocumento));
                }


                return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
        
}