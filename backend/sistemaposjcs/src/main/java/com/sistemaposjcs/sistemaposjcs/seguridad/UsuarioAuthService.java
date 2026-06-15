package com.sistemaposjcs.sistemaposjcs.seguridad;

import com.sistemaposjcs.sistemaposjcs.model.Usuario;
import com.sistemaposjcs.sistemaposjcs.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioAuthService {

    private final UserRepository userRepository;

    public UsuarioAuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Usuario getUsuarioLogueado() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth instanceof AnonymousAuthenticationToken || auth.getName() == null) {
            throw new RuntimeException("No hay usuario autenticado");
        }

        String username = auth.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));
    }
}
