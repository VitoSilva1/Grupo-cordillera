package com.grupocordillera.authservice.service;

import com.grupocordillera.authservice.client.UserClient;
import com.grupocordillera.authservice.dto.UserDto;
import com.grupocordillera.authservice.dto.UserProfileDto;
import com.grupocordillera.authservice.model.User;
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
    private UserClient userClient;
    private List<User> users;

    @BeforeEach
    void setUp() {
        userClient = mock(UserClient.class);
        users = new ArrayList<>();

        when(userClient.findAll()).thenAnswer(inv -> new ArrayList<>(users));
        when(userClient.create(any(UserDto.class))).thenAnswer(inv -> {
            UserDto userDto = inv.getArgument(0);
            if (users.stream().anyMatch(user -> user.getUsername().equals(userDto.getUsername()))) {
                throw new IllegalArgumentException("El usuario ya existe");
            }
            if (users.stream().anyMatch(user -> user.getEmail().equalsIgnoreCase(userDto.getEmail()))) {
                throw new IllegalArgumentException("El email ya existe");
            }
            User user = new User(userDto.getUsername(), userDto.getEmail(), userDto.getPassword(), userDto.getRole());
            users.removeIf(existing -> existing.getUsername().equals(user.getUsername()));
            users.add(user);
            return user;
        });
        when(userClient.authenticate(any(), any())).thenAnswer(inv -> {
            String login = inv.getArgument(0);
            String password = inv.getArgument(1);
            return users.stream()
                    .filter(user -> user.getUsername().equals(login) || user.getEmail().equalsIgnoreCase(login))
                    .filter(user -> user.getPassword().equals(password))
                    .findFirst();
        });

        userService = new UserService(userClient);
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
