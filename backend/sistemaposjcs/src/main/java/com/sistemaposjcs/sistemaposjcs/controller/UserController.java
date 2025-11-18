package com.sistemaposjcs.sistemaposjcs.controller;

import com.sistemaposjcs.sistemaposjcs.dto.UserDTO;
import com.sistemaposjcs.sistemaposjcs.model.Usuario;
import com.sistemaposjcs.sistemaposjcs.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // permitir conexión desde React
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }



    //  1. Listar todos los usuarios
@GetMapping
public List<UserDTO> getAllActiveUsers() {
    return userService.getAllActiveUsers()
        .stream()
        .map(u -> new UserDTO(
            u.getIdUsuario(),
            u.getUsername(),
            u.getNombre(),
            u.getApellido(),
            u.getDocumento(),
            u.getRol(),
            u.getEmail(),
            u.getTelefono(),
            u.getEstado()))
        .toList();
}

@GetMapping("/inactivos")
public List<UserDTO> getInactiveUsers() {
    return userService.getAllUsers()
        .stream()
        .filter(u -> u.getEstado() == false)
        .map(u -> new UserDTO(
            u.getIdUsuario(),
            u.getUsername(),
            u.getNombre(),
            u.getApellido(),
            u.getDocumento(),
            u.getRol(),
            u.getEmail(),
            u.getTelefono(),
            u.getEstado()))
        .toList();
}



    //  2. Obtener un usuario por ID
    @GetMapping("/{id}")
    public Usuario getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    //  3. Crear usuario
    @PostMapping
    public ResponseEntity<Usuario> createUser(@Valid @RequestBody Usuario user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    //  4. Actualizar usuario
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> updateUser(@PathVariable Long id, @Validated(Usuario.OnUpdate.class) @RequestBody Usuario user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    //  5. Eliminar usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/activar")
    public ResponseEntity<Usuario> activarUsuario(@PathVariable Long id) {
        return ResponseEntity.ok(userService.activarUsuario(id));
    }


}

