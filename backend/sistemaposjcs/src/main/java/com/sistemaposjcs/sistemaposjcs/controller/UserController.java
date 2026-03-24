package com.sistemaposjcs.sistemaposjcs.controller;

import com.sistemaposjcs.sistemaposjcs.dto.UserDTO;
import com.sistemaposjcs.sistemaposjcs.model.Usuario;
import com.sistemaposjcs.sistemaposjcs.service.UserService;
import com.sistemaposjcs.sistemaposjcs.model.Enum.TipoDocumento;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // permitir conexión desde React
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

        // 🔹 Convertir entidad → DTO
    private UserDTO convertirUser(Usuario u) {

        return new UserDTO(
            u.getIdUsuario(),
            u.getUsername(),
            u.getPrimerNombre(),
            u.getSegundoNombre(),
            u.getPrimerApellido(),
            u.getSegundoApellido(),
            u.getTipoDocumento(),
            u.getDocumento(),
            u.getRol(),
            u.getEmail(),
            u.getTelefono(),
            u.getEstado()
        );
    }


    // ✅ 1. usuarios activos
    @GetMapping
    public Page<UserDTO> getActiveUsers(Pageable pageable) {

        return userService.getActiveUsers(pageable)
        .map(this::convertirUser);
    } 
    

    // ✅ 2. usuarios inactivos
    @GetMapping("/inactivos")
    public Page<UserDTO> getInactiveUsers(Pageable pageable) {

        return userService.getInactiveUsers(pageable)
        .map(this::convertirUser);
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

    //  5. Activar/Desactivar usuario
    @PatchMapping("/desactivar/{id}")
    public ResponseEntity<Void> desactivarUsuario(@PathVariable Long id) {
        userService.desactivarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/activar/{id}")
    public ResponseEntity<Usuario> activarUsuario(@PathVariable Long id) {
        return ResponseEntity.ok(userService.activarUsuario(id));
    }

    @GetMapping("/tipos-documento")
    public TipoDocumento[] listarTiposDocumento() {
        return TipoDocumento.values();
    }

    @GetMapping("/search")
    public Page<UserDTO> searchUsuarios(
        Pageable pageable,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String rol,
        @RequestParam(required = false) Boolean estado,
        @RequestParam(required = false) TipoDocumento tipoDocumento,
        @RequestParam(required = false) String documento
    ) {
        return userService.searchUsuarios(
            pageable, search, rol, estado, tipoDocumento, documento
        ).map(this::convertirUser);
    }
}