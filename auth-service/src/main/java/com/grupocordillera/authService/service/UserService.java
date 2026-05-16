package com.grupocordillera.authService.service;

import com.grupocordillera.authService.dto.UserDto;
import com.grupocordillera.authService.dto.UserProfileDto;
import com.grupocordillera.authService.model.User;
import com.grupocordillera.authService.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    private static final Set<String> ALLOWED_ROLES = Set.of("Gerente", "Supervisor", "Vendedor");

    private final UserRepository userRepository;
    

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(UserDto userDto) {
        validateRegisterDto(userDto);

        String email = userDto.getEmail().trim().toLowerCase();
        String username = userDto.getUsername().trim();
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("El usuario ya existe");
        }

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("El email ya existe");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(userDto.getPassword());
        user.setRole(userDto.getRole().trim());
        return userRepository.save(user);
    }

    public boolean authenticate(UserDto userDto) {
        validateLoginDto(userDto);

        String login = userDto.getUsername().trim();
        Optional<User> user = userRepository.findByUsername(login)
                .or(() -> userRepository.findByEmailIgnoreCase(login));

        return user
                .map(foundUser -> foundUser.getPassword().equals(userDto.getPassword()))
                .orElse(false);
    }

    public Optional<User> authenticateAndGetUser(UserDto userDto) {
        validateLoginDto(userDto);

        String login = userDto.getUsername().trim();
        Optional<User> user = userRepository.findByUsername(login)
                .or(() -> userRepository.findByEmailIgnoreCase(login));

        return user
                .filter(foundUser -> foundUser.getPassword().equals(userDto.getPassword()));
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public UserProfileDto getCurrentUserProfile() {
        Optional<User> currentUser = userRepository.findAll().stream().findFirst();
        if (currentUser.isPresent()) {
            User user = currentUser.get();
            return new UserProfileDto(
                    user.getUsername(),
                    user.getUsername(),
                    user.getRole(),
                    user.getEmail(),
                    user.getUsername()
            );
        }

        return new UserProfileDto(
                "guest",
                "Invitado",
                "Sin cargo",
                null,
                "guest"
        );
    }
    private void validateRegisterDto(UserDto userDto) {
        if (userDto == null) {
            throw new IllegalArgumentException("El cuerpo de la solicitud es obligatorio");
        }

        if (userDto.getEmail() == null || userDto.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }

        String email = userDto.getEmail().trim();
        if (!email.contains("@")) {
            throw new IllegalArgumentException("El email no es valido");
        }

        if (userDto.getRole() == null || userDto.getRole().trim().isEmpty()) {
            throw new IllegalArgumentException("El role es obligatorio");
        }

        String role = userDto.getRole().trim();
        if (!ALLOWED_ROLES.contains(role)) {
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
