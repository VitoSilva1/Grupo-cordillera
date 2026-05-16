package com.grupocordillera.authService.service;

import com.grupocordillera.authService.dto.UserDto;
import com.grupocordillera.authService.dto.UserProfileDto;
import com.grupocordillera.authService.model.User;
import com.grupocordillera.authService.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class UserServiceTest {

    private UserService userService;
    private UserRepository userRepository;
    private List<User> users;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        users = new ArrayList<>();

        when(userRepository.existsByUsername(any())).thenAnswer(inv -> users.stream()
                .anyMatch(u -> u.getUsername().equals(inv.getArgument(0))));
        when(userRepository.existsByEmailIgnoreCase(any())).thenAnswer(inv -> users.stream()
                .anyMatch(u -> u.getEmail().equalsIgnoreCase(inv.getArgument(0))));
        when(userRepository.existsByEmail(any())).thenAnswer(inv -> users.stream()
                .anyMatch(u -> u.getEmail().equals(inv.getArgument(0))));
        when(userRepository.findByUsername(any())).thenAnswer(inv -> users.stream()
                .filter(u -> u.getUsername().equals(inv.getArgument(0)))
                .findFirst());
        when(userRepository.findByEmailIgnoreCase(any())).thenAnswer(inv -> users.stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(inv.getArgument(0)))
                .findFirst());
        when(userRepository.findAll()).thenAnswer(inv -> new ArrayList<>(users));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User user = inv.getArgument(0);
            users.removeIf(existing -> existing.getUsername().equals(user.getUsername()));
            users.add(user);
            return user;
        });

        userService = new UserService(userRepository);
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
                () -> userService.register(new UserDto("otro@mail.com", "victor", "abcd", "Supervisor")));

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
    void authenticateShouldReturnTrueWhenUsingEmailAsLogin() {
        userService.register(new UserDto("victor@mail.com", "victor", "1234", "Gerente"));

        assertTrue(userService.authenticate(new UserDto(null, "victor@mail.com", "1234", null)));
    }

    @Test
    void registerShouldFailWhenEmailAlreadyExists() {
        userService.register(new UserDto("victor@mail.com", "victor", "1234", "Gerente"));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.register(new UserDto("victor@mail.com", "victor2", "abcd", "Supervisor")));

        assertEquals("El email ya existe", exception.getMessage());
    }

    @Test
    void registerShouldFailWhenRoleIsInvalid() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.register(new UserDto("victor@mail.com", "victor", "1234", "Admin")));

        assertEquals("El role debe ser Gerente, Supervisor o Vendedor", exception.getMessage());
    }

    @Test
    void getCurrentUserProfileShouldReturnGuestWhenNoUserExists() {
        UserProfileDto profile = userService.getCurrentUserProfile();

        assertEquals("guest", profile.id());
        assertEquals("Invitado", profile.name());
        assertEquals("Sin cargo", profile.role());
    }

    @Test
    void authenticateShouldThrowWhenUsernameIsMissing() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.authenticate(new UserDto(null, "", "1234", null)));

        assertEquals("El username es obligatorio", exception.getMessage());
    }

    @Test
    void registerShouldFailWhenEmailFormatIsInvalid() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.register(new UserDto("victor.mail.com", "victor", "1234", "Gerente")));

        assertEquals("El email no es valido", exception.getMessage());
    }
}
