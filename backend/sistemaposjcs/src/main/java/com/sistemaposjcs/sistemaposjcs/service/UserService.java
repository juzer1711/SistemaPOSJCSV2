package com.sistemaposjcs.sistemaposjcs.service;

import com.sistemaposjcs.sistemaposjcs.model.Usuario;
import com.sistemaposjcs.sistemaposjcs.model.Rol;
import com.sistemaposjcs.sistemaposjcs.repository.RolRepository;
import com.sistemaposjcs.sistemaposjcs.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RolRepository rolRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository , RolRepository rolRepository) {
        this.userRepository = userRepository;
        this.rolRepository = rolRepository;
    }

    // ✅ Listar todos los usuarios
    public List<Usuario> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ Obtener usuario por ID
    public Usuario getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
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
        usuario.setNombre(userDetails.getNombre());
        usuario.setApellido(userDetails.getApellido());
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

    public List<Usuario> getAllActiveUsers() {
    return userRepository.findByEstadoTrue();
    }


    public void deleteUser(Long id) {
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

    
}
