package com.sistemaposjcs.sistemaposjcs.service;

import com.sistemaposjcs.sistemaposjcs.model.Usuario;
import com.sistemaposjcs.sistemaposjcs.model.Role;
import com.sistemaposjcs.sistemaposjcs.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        if (usuario.getRole() == null) usuario.setRole(Role.CAJERO);
        return userRepository.save(usuario);
    }

    // ✅ Actualizar usuario
    public Usuario updateUser(Long id, Usuario userDetails) {
        Usuario usuario = getUserById(id);
        usuario.setUsername(userDetails.getUsername());
        usuario.setNombre(userDetails.getNombre());
        usuario.setApellido(userDetails.getApellido());
        usuario.setDocumento(userDetails.getDocumento());
        usuario.setRole(userDetails.getRole());
        usuario.setEmail(userDetails.getEmail());
        usuario.setTelefono(userDetails.getTelefono());
        
    if (userDetails.getPassword() != null && !userDetails.getPassword().isBlank()) {
        usuario.setPassword(passwordEncoder.encode(userDetails.getPassword()));
    }

        return userRepository.save(usuario);
    }

    // ✅ Eliminar usuario
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }    
}
