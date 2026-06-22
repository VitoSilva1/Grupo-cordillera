package com.grupocordillera.authservice.service;

import com.grupocordillera.authservice.client.UserClient;
import com.grupocordillera.authservice.dto.UserDto;
import com.grupocordillera.authservice.dto.UserProfileDto;
import com.grupocordillera.authservice.model.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    private static final Set<String> ALLOWED_ROLES = Set.of("Gerente", "Supervisor", "Vendedor");

    private final UserClient userClient;

    public UserService(UserClient userClient) {
        this.userClient = userClient;
    }

    public User register(UserDto userDto) {
        validateRegisterDto(userDto);
        userDto.setEmail(userDto.getEmail().trim().toLowerCase());
        userDto.setUsername(userDto.getUsername().trim());
        userDto.setRole(userDto.getRole().trim());
        return userClient.create(userDto);
    }

    public boolean authenticate(UserDto userDto) {
        return authenticateAndGetUser(userDto).isPresent();
    }

    public Optional<User> authenticateAndGetUser(UserDto userDto) {
        validateLoginDto(userDto);
        return userClient.authenticate(userDto.getUsername().trim(), userDto.getPassword());
    }

    public List<User> findAll() {
        return userClient.findAll();
    }

    public UserProfileDto getCurrentUserProfile() {
        return userClient.findAll().stream()
                .findFirst()
                .map(user -> new UserProfileDto(
                        user.getUsername(),
                        fullNameOrUsername(user),
                        user.getRole(),
                        user.getEmail(),
                        user.getUsername()
                ))
                .orElseGet(() -> new UserProfileDto("guest", "Invitado", "Sin cargo", null, "guest"));
    }

    private String fullNameOrUsername(User user) {
        String fullName = String.join(" ",
                Optional.ofNullable(user.getFirstName()).orElse("").trim(),
                Optional.ofNullable(user.getLastName()).orElse("").trim()
        ).trim();
        return fullName.isBlank() ? user.getUsername() : fullName;
    }

    private void validateRegisterDto(UserDto userDto) {
        if (userDto == null) {
            throw new IllegalArgumentException("El cuerpo de la solicitud es obligatorio");
        }
        if (userDto.getEmail() == null || userDto.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }
        if (!userDto.getEmail().trim().contains("@")) {
            throw new IllegalArgumentException("El email no es valido");
        }
        if (userDto.getRole() == null || userDto.getRole().trim().isEmpty()) {
            throw new IllegalArgumentException("El role es obligatorio");
        }
        if (!ALLOWED_ROLES.contains(userDto.getRole().trim())) {
            throw new IllegalArgumentException("El role debe ser Gerente, Supervisor o Vendedor");
        }
        validateUsernameAndPassword(userDto);
    }

    private void validateLoginDto(UserDto userDto) {
        if (userDto == null) {
            throw new IllegalArgumentException("El cuerpo de la solicitud es obligatorio");
        }
        validateUsernameAndPassword(userDto);
    }

    private void validateUsernameAndPassword(UserDto userDto) {
        if (userDto.getUsername() == null || userDto.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("El username es obligatorio");
        }
        if (userDto.getPassword() == null || userDto.getPassword().isBlank()) {
            throw new IllegalArgumentException("La password es obligatoria");
        }
    }
}
