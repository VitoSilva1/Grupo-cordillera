package com.grupocordillera.userservice.service;

import com.grupocordillera.userservice.dto.CreateUserRequest;
import com.grupocordillera.userservice.model.User;
import com.grupocordillera.userservice.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class UserManagementServiceTest {

    private UserManagementService userManagementService;
    private List<User> users;

    @BeforeEach
    void setUp() {
        UserRepository userRepository = mock(UserRepository.class);
        users = new ArrayList<>();

        when(userRepository.existsByUsername(any())).thenAnswer(inv -> users.stream()
                .anyMatch(user -> user.getUsername().equals(inv.getArgument(0))));
        when(userRepository.existsByEmailIgnoreCase(any())).thenAnswer(inv -> users.stream()
                .anyMatch(user -> user.getEmail().equalsIgnoreCase(inv.getArgument(0))));
        when(userRepository.findAll()).thenAnswer(inv -> new ArrayList<>(users));
        when(userRepository.findByUsername(any())).thenAnswer(inv -> users.stream()
                .filter(user -> user.getUsername().equals(inv.getArgument(0)))
                .findFirst());
        when(userRepository.findByEmailIgnoreCase(any())).thenAnswer(inv -> users.stream()
                .filter(user -> user.getEmail().equalsIgnoreCase(inv.getArgument(0)))
                .findFirst());
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User user = inv.getArgument(0);
            users.add(user);
            return user;
        });

        userManagementService = new UserManagementService(userRepository);
    }

    @Test
    void createShouldSaveUser() {
        User user = userManagementService.create(new CreateUserRequest(
                "victor",
                "VICTOR@MAIL.COM",
                "1234",
                "Victor",
                "Perez",
                "Gerente"
        ));

        assertEquals("victor", user.getUsername());
        assertEquals("victor@mail.com", user.getEmail());
        assertEquals("Victor", user.getFirstName());
        assertEquals(1, userManagementService.findAll().size());
    }

    @Test
    void createShouldFailWhenUsernameExists() {
        userManagementService.create(validRequest("victor", "victor@mail.com"));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userManagementService.create(validRequest("victor", "otro@mail.com"))
        );

        assertEquals("El usuario ya existe", exception.getMessage());
    }

    @Test
    void createShouldFailWhenEmailExists() {
        userManagementService.create(validRequest("victor", "victor@mail.com"));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userManagementService.create(validRequest("otro", "VICTOR@MAIL.COM"))
        );

        assertEquals("El email ya existe", exception.getMessage());
    }

    @Test
    void createShouldFailWhenRoleIsInvalid() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userManagementService.create(new CreateUserRequest(
                        "victor",
                        "victor@mail.com",
                        "1234",
                        "Victor",
                        "Perez",
                        "Admin"
                ))
        );

        assertEquals("El role debe ser Gerente, Supervisor o Vendedor", exception.getMessage());
    }

    private CreateUserRequest validRequest(String username, String email) {
        return new CreateUserRequest(username, email, "1234", "Victor", "Perez", "Gerente");
    }
}
