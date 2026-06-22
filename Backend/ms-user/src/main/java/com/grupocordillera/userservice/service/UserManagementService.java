package com.grupocordillera.userservice.service;

import com.grupocordillera.userservice.dto.CreateUserRequest;
import com.grupocordillera.userservice.model.User;
import com.grupocordillera.userservice.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserManagementService {

    private static final Set<String> ALLOWED_ROLES = Set.of("Gerente", "Supervisor", "Vendedor");

    private final UserRepository userRepository;

    public UserManagementService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User create(CreateUserRequest request) {
        validateCreateRequest(request);

        String username = request.username().trim();
        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("El usuario ya existe");
        }

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("El email ya existe");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(request.password());
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setRole(request.role().trim());

        return userRepository.save(user);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> authenticate(String login, String password) {
        validateRequired(login, "El login es obligatorio");
        validateRequired(password, "La password es obligatoria");

        String normalizedLogin = login.trim();
        return userRepository.findByUsername(normalizedLogin)
                .or(() -> userRepository.findByEmailIgnoreCase(normalizedLogin))
                .filter(user -> user.getPassword().equals(password));
    }

    private void validateCreateRequest(CreateUserRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("El cuerpo de la solicitud es obligatorio");
        }

        validateRequired(request.username(), "El username es obligatorio");
        validateRequired(request.email(), "El email es obligatorio");
        validateRequired(request.password(), "La password es obligatoria");
        validateRequired(request.firstName(), "El nombre es obligatorio");
        validateRequired(request.lastName(), "El apellido es obligatorio");
        validateRequired(request.role(), "El role es obligatorio");

        if (!request.email().trim().contains("@")) {
            throw new IllegalArgumentException("El email no es valido");
        }

        if (!ALLOWED_ROLES.contains(request.role().trim())) {
            throw new IllegalArgumentException("El role debe ser Gerente, Supervisor o Vendedor");
        }
    }

    private void validateRequired(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(message);
        }
    }
}
