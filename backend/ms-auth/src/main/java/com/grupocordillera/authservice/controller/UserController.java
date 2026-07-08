package com.grupocordillera.authservice.controller;

import com.grupocordillera.authservice.dto.UserDto;
import com.grupocordillera.authservice.dto.UserProfileDto;
import com.grupocordillera.authservice.model.User;
import com.grupocordillera.authservice.service.JwtService;
import com.grupocordillera.authservice.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "auth-service");
    }

    @GetMapping("/users/me")
    public ResponseEntity<UserProfileDto> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUserProfile());
    }

    @GetMapping("/public-key")
    public Map<String, String> getPublicKey() {
        return Map.of(
                "algorithm", "RS256",
                "keyId", "auth-service-rsa",
                "publicKey", jwtService.getPublicKeyPem()
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDto userDto) {
        try {
            User user = userService.register(userDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Usuario registrado correctamente",
                    "email", user.getEmail(),
                    "username", user.getUsername(),
                    "role", user.getRole()
            ));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDto userDto) {
        try {
            var authenticatedUser = userService.authenticateAndGetUser(userDto);
            if (authenticatedUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Credenciales invalidas"));
            }

            User user = authenticatedUser.get();
            String accessToken = jwtService.generateToken(user);
            return ResponseEntity.ok(Map.of(
                    "message", "Autenticacion exitosa",
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "role", user.getRole(),
                    "tokenType", "Bearer",
                    "expiresIn", 3600,
                    "accessToken", accessToken
            ));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(userService.findAll());
    }
}
