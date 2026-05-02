package com.grupocordillera.authService.service;

import com.grupocordillera.authService.dto.UserDto;
import com.grupocordillera.authService.model.User;
import com.grupocordillera.authService.repository.InMemoryUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class UserServiceTest {

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(new InMemoryUserRepository());
    }

    @Test
    void registerShouldSaveUser() {
        User user = userService.register(new UserDto("victor@mail.com", "victor", "1234", "Gerente"));

        assertEquals("victor", user.getUsername());
        assertEquals("victor@mail.com", user.getEmail());
        assertEquals("Gerente", user.getRole());
        assertEquals(1, userService.findAll().size());
    }

    @Test
    void registerShouldFailWhenUserAlreadyExists() {
        userService.register(new UserDto("victor@mail.com", "victor", "1234", "Gerente"));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.register(new UserDto("otro@mail.com", "victor", "abcd", "Supervisor"))
        );

        assertEquals("El usuario ya existe", exception.getMessage());
    }

    @Test
    void authenticateShouldReturnTrueForValidCredentials() {
        userService.register(new UserDto("victor@mail.com", "victor", "1234", "Gerente"));

        assertTrue(userService.authenticate(new UserDto(null, "victor", "1234", null)));
    }

    @Test
    void authenticateShouldReturnFalseForInvalidCredentials() {
        userService.register(new UserDto("victor@mail.com", "victor", "1234", "Gerente"));

        assertFalse(userService.authenticate(new UserDto(null, "victor", "wrong", null)));
    }

    @Test
    void registerShouldFailWhenEmailAlreadyExists() {
        userService.register(new UserDto("victor@mail.com", "victor", "1234", "Gerente"));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.register(new UserDto("victor@mail.com", "victor2", "abcd", "Supervisor"))
        );

        assertEquals("El email ya existe", exception.getMessage());
    }

    @Test
    void registerShouldFailWhenRoleIsInvalid() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.register(new UserDto("victor@mail.com", "victor", "1234", "Admin"))
        );

        assertEquals("El role debe ser Gerente, Supervisor o Vendedor", exception.getMessage());
    }
}
