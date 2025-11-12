package com.sistemaposjcs.sistemaposjcs.service;


import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // si usas
import com.sistemaposjcs.sistemaposjcs.dto.LoginRequest;
import com.sistemaposjcs.sistemaposjcs.model.Usuario;
import com.sistemaposjcs.sistemaposjcs.repository.UserRepository;
import com.sistemaposjcs.sistemaposjcs.seguridad.JwtUtil;
import com.sistemaposjcs.sistemaposjcs.dto.LoginResponse;



// Marcamos esta clase como un "Service", es decir, un componente de la capa de lógica de negocio
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
    this.userRepository = userRepository;
    this.passwordEncoder = new BCryptPasswordEncoder();
    this.jwtUtil = jwtUtil;
    }

    /**
     * Método principal para manejar el login.
     * 
     * @param req Objeto LoginRequest con los datos del usuario (username y password)
     * @return Un objeto LoginResponse con el resultado del login
     */
    public LoginResponse IniciarSesion(LoginRequest req) {
        // Buscamos el usuario por su nombre de usuario en la base de datos
        Optional<Usuario> uOpt = userRepository.findByUsername(req.getUsername());

         // Si no se encuentra el usuario, devolvemos una respuesta de error
        if (uOpt.isEmpty()) {
            return new LoginResponse("error", null, "Usuario no encontrado", null);
        }

        // Obtenemos el usuario del Optional
        Usuario usuario = uOpt.get();

        // Verificamos la contraseña usando BCrypt
        if (passwordEncoder.matches(req.getPassword(), usuario.getPassword())) {
             // 🔑 Generar token JWT
            String token = jwtUtil.generateToken(usuario.getUsername(), usuario.getRole().name());
            // Si coincide, devolvemos respuesta exitosa con el rol del usuario
            return new LoginResponse("ok", usuario.getRole().name(), "Login exitoso", token);
        } else {
            // Si no coincide, devolvemos error de credenciales inválidas
            return new LoginResponse("error", null, "Credenciales inválidas", null);
        }
    }

}
