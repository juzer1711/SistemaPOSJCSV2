package com.sistemaposjcs.sistemaposjcs.service;

import com.sistemaposjcs.sistemaposjcs.model.Usuario;
import com.sistemaposjcs.sistemaposjcs.model.Enum.TipoDocumento;
import com.sistemaposjcs.sistemaposjcs.model.Rol;
import com.sistemaposjcs.sistemaposjcs.repository.RolRepository;
import com.sistemaposjcs.sistemaposjcs.repository.UserRepository;
import com.sistemaposjcs.sistemaposjcs.seguridad.UsuarioAuthService;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.ArrayList;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Expression;
import java.util.List;
import jakarta.persistence.criteria.Predicate;
import static com.sistemaposjcs.sistemaposjcs.specification.SpecificationUtils.nombreCompleto;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RolRepository rolRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final AuditoriaService auditoriaService;
    private final UsuarioAuthService usuarioAuthService;

    public UserService(
            UserRepository userRepository,
            RolRepository rolRepository,
            AuditoriaService auditoriaService,
            UsuarioAuthService usuarioAuthService
    ) {
        this.userRepository = userRepository;
        this.rolRepository = rolRepository;
        this.auditoriaService = auditoriaService;
        this.usuarioAuthService = usuarioAuthService;
    }

    // Obtener usuario por ID
    public Usuario getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    // Listar todos los usuarios inactivos
    public Page<Usuario> getInactiveUsers(Pageable pageable) {
        return userRepository.findByEstadoFalse(pageable);
    }

    public Page<Usuario> getActiveUsers(Pageable pageable) {
        return userRepository.findByEstadoTrue(pageable);
    }

    // Crear usuario
    public Usuario createUser(Usuario usuario) {
        
        if (usuario.getEstado() == null) {
            usuario.setEstado(true);
        }

        //  Reemplazar rol recibido con el rol REAL de la BD
        if (usuario.getRol() != null && usuario.getRol().getId() != null) {
            Rol rolReal = rolRepository.findById(usuario.getRol().getId())
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
            usuario.setRol(rolReal);
        }

        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        Usuario usuarioGuardado = userRepository.save(usuario);

        try {

            Usuario administrador = usuarioAuthService.getUsuarioLogueado();

            String descripcion =
                    "Usuario creado.\n" +
                    "Nombre: " + usuarioGuardado.getNombreCompleto() + ".\n" +
                    "Usuario: " + usuarioGuardado.getUsername() + ".\n" +
                    "Rol: " + usuarioGuardado.getRol().getNombre() + ".";

            auditoriaService.registrar(
                    administrador,
                    "USUARIO",
                    "CREAR",
                    descripcion
            );

        } catch (Exception e) {
            System.out.println("Error auditoría usuario: " + e.getMessage());
        }

        return usuarioGuardado;
    }

    // Actualizar usuario
    public Usuario updateUser(Long id, Usuario userDetails) {

        Usuario usuario = getUserById(id);

        // ===== Valores anteriores =====
        String usernameAnterior = usuario.getUsername();
        String primerNombreAnterior = usuario.getPrimerNombre();
        String segundoNombreAnterior = usuario.getSegundoNombre();
        String primerApellidoAnterior = usuario.getPrimerApellido();
        String segundoApellidoAnterior = usuario.getSegundoApellido();
        String documentoAnterior = usuario.getDocumento();
        String emailAnterior = usuario.getEmail();
        String telefonoAnterior = usuario.getTelefono();

        Rol rolAnterior = usuario.getRol();

        // ===== Actualizar datos =====
        usuario.setUsername(userDetails.getUsername());
        usuario.setPrimerNombre(userDetails.getPrimerNombre());
        usuario.setSegundoNombre(userDetails.getSegundoNombre());
        usuario.setPrimerApellido(userDetails.getPrimerApellido());
        usuario.setSegundoApellido(userDetails.getSegundoApellido());
        usuario.setTipoDocumento(userDetails.getTipoDocumento());
        usuario.setDocumento(userDetails.getDocumento());
        usuario.setEmail(userDetails.getEmail());
        usuario.setTelefono(userDetails.getTelefono());

        if (userDetails.getRol() != null && userDetails.getRol().getId() != null) {
            Rol nuevoRol = rolRepository.findById(userDetails.getRol().getId())
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
            usuario.setRol(nuevoRol);
        }

        if (userDetails.getPassword() != null && !userDetails.getPassword().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        Usuario usuarioActualizado = userRepository.save(usuario);

        try {

            Usuario administrador = usuarioAuthService.getUsuarioLogueado();

            List<String> cambios = new ArrayList<>();

            if (!java.util.Objects.equals(usernameAnterior, userDetails.getUsername())) {
                cambios.add("Usuario: '" + usernameAnterior + "' → '" + userDetails.getUsername() + "'");
            }

            if (!java.util.Objects.equals(primerNombreAnterior, userDetails.getPrimerNombre())) {
                cambios.add("Primer nombre: '" + primerNombreAnterior + "' → '" + userDetails.getPrimerNombre() + "'");
            }

            if (!java.util.Objects.equals(segundoNombreAnterior, userDetails.getSegundoNombre())) {
                cambios.add("Segundo nombre: '" +
                        java.util.Objects.toString(segundoNombreAnterior, "") +
                        "' → '" +
                        java.util.Objects.toString(userDetails.getSegundoNombre(), "") +
                        "'");
            }

            if (!java.util.Objects.equals(primerApellidoAnterior, userDetails.getPrimerApellido())) {
                cambios.add("Primer apellido: '" + primerApellidoAnterior + "' → '" + userDetails.getPrimerApellido() + "'");
            }

            if (!java.util.Objects.equals(segundoApellidoAnterior, userDetails.getSegundoApellido())) {
                cambios.add("Segundo apellido: '" +
                        java.util.Objects.toString(segundoApellidoAnterior, "") +
                        "' → '" +
                        java.util.Objects.toString(userDetails.getSegundoApellido(), "") +
                        "'");
            }

            if (!java.util.Objects.equals(documentoAnterior, userDetails.getDocumento())) {
                cambios.add("Documento: '" + documentoAnterior + "' → '" + userDetails.getDocumento() + "'");
            }

            if (!java.util.Objects.equals(emailAnterior, userDetails.getEmail())) {
                cambios.add("Email: '" +
                        java.util.Objects.toString(emailAnterior, "") +
                        "' → '" +
                        java.util.Objects.toString(userDetails.getEmail(), "") +
                        "'");
            }

            if (!java.util.Objects.equals(telefonoAnterior, userDetails.getTelefono())) {
                cambios.add("Teléfono: '" +
                        java.util.Objects.toString(telefonoAnterior, "") +
                        "' → '" +
                        java.util.Objects.toString(userDetails.getTelefono(), "") +
                        "'");
            }

            if (!java.util.Objects.equals(rolAnterior.getId(), usuario.getRol().getId())) {
                cambios.add("Rol: '" +
                        rolAnterior.getNombre() +
                        "' → '" +
                        usuario.getRol().getNombre() +
                        "'");
            }

            if (userDetails.getPassword() != null && !userDetails.getPassword().isBlank()) {
                cambios.add("Contraseña actualizada.");
            }

            if (!cambios.isEmpty()) {

                String descripcion =
                        "Usuario '" + usuarioActualizado.getNombreCompleto() + "'.\n" +
                        String.join("\n", cambios);

                auditoriaService.registrar(
                        administrador,
                        "USUARIO",
                        "ACTUALIZAR",
                        descripcion
                );
            }

        } catch (Exception e) {
            System.out.println("Error auditoría usuario: " + e.getMessage());
        }

        return usuarioActualizado;
    }

    // Desactivar usuario usuario
    public void desactivarUsuario(Long id) {

        System.out.println("Entró a desactivar usuario");

        Usuario usuario = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setEstado(false);

        Usuario usuarioDesactivado = userRepository.save(usuario);

        try {

            System.out.println("Entró a la auditoría");

            Usuario administrador = usuarioAuthService.getUsuarioLogueado();

            String descripcion =
                    "Usuario desactivado.\n" +
                    "Nombre: " + usuarioDesactivado.getNombreCompleto() + ".\n" +
                    "Usuario: " + usuarioDesactivado.getUsername() + ".";

            auditoriaService.registrar(
                    administrador,
                    "USUARIO",
                    "DESACTIVAR",
                    descripcion
            );

        } catch (Exception e) {
            System.out.println("Error auditoría usuario: " + e.getMessage());
        }
    }

    // Activar usuario
    public Usuario activarUsuario(Long id) {

        Usuario u = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        u.setEstado(true);

        Usuario usuarioActivado = userRepository.save(u);

        try {

            Usuario administrador = usuarioAuthService.getUsuarioLogueado();

            String descripcion =
                    "Usuario reactivado.\n" +
                    "Nombre: " + usuarioActivado.getNombreCompleto() + ".\n" +
                    "Usuario: " + usuarioActivado.getUsername() + ".";

            auditoriaService.registrar(
                    administrador,
                    "USUARIO",
                    "ACTIVAR",
                    descripcion
            );

        } catch (Exception e) {
            System.out.println("Error auditoría usuario: " + e.getMessage());
        }

        return usuarioActivado;
    }

    public Page<Usuario> searchUsuarios(
        Pageable pageable,
        String search,
        String rol,
        Boolean estado,
        TipoDocumento tipoDocumento
    ) {
        Specification<Usuario> spec = buildSpec(search, rol, estado, tipoDocumento);
        return userRepository.findAll(spec, pageable);
    }

    public Specification<Usuario> buildSpec(
        String search,
        String rol,
        Boolean estado,
        TipoDocumento tipoDocumento
    ) {
        return (root, query, cb) -> {
                List<Predicate> predicates = new ArrayList<>();

                // búsqueda global (nombre o email)
                if (search != null && !search.isEmpty()) {
                    String like = "%" + search.toLowerCase().replace(" ", "") + "%";
                    Expression<String> nombre = nombreCompleto(cb, root);

                    predicates.add(cb.or(
                        cb.like(nombre, like),
                        cb.like(cb.lower(root.get("documento")), like)
                    ));
                }

                // rol
                // Filtro por Rol (Entidad)
                if (rol != null) {
                    // Hacemos el JOIN con la tabla de roles y filtramos por su ID
                    predicates.add(cb.equal(root.join("rol").get("nombre"), rol));
                }

                // estado
                if (estado != null) {
                    predicates.add(cb.equal(root.get("estado"), estado));
                }

                // tipo documento
                if (tipoDocumento != null) {
                    predicates.add(cb.equal(root.get("tipoDocumento"), tipoDocumento));
                }


                return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
        
}