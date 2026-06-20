package com.grupocordillera.authservice.controller;

import com.grupocordillera.authservice.client.UserClient;
import com.grupocordillera.authservice.dto.UserDto;
import com.grupocordillera.authservice.dto.UserProfileDto;
import com.grupocordillera.authservice.model.User;
import com.grupocordillera.authservice.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;

class UserControllerTest {

    @Test
    void healthShouldReturnUpStatus() {
        UserController controller = new UserController(new StubUserService(), null);

        Map<String, String> response = controller.health();

        assertEquals("UP", response.get("status"));
        assertEquals("auth-service", response.get("service"));
    }

    @Test
    void getUsersMeShouldReturnCurrentUserProfile() {
        StubUserService service = new StubUserService();
        service.profile = new UserProfileDto("mock-user", "Mock User", "Supervisor", "mock@mail.com", "mockuser");
        UserController controller = new UserController(service, null);

        ResponseEntity<UserProfileDto> response = controller.getCurrentUser();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("mock-user", response.getBody().id());
        assertEquals("Supervisor", response.getBody().role());
    }

    @Test
    void registerShouldReturnCreatedResponse() {
        StubUserService service = new StubUserService();
        service.registeredUser = new User("victor", "victor@mail.com", "1234", "Gerente");
        UserController controller = new UserController(service, null);

        ResponseEntity<?> response = controller.register(new UserDto("victor@mail.com", "victor", "1234", "Gerente"));

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("Usuario registrado correctamente", body.get("message"));
        assertEquals("victor@mail.com", body.get("email"));
    }

    @Test
    void loginShouldReturnUnauthorizedForInvalidCredentials() {
        UserController controller = new UserController(new StubUserService(), null);

        ResponseEntity<?> response = controller.login(new UserDto(null, "victor", "wrong", null));

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("Credenciales invalidas", body.get("error"));
    }

    private static class StubUserService extends UserService {
        private UserProfileDto profile = new UserProfileDto("guest", "Invitado", "Sin cargo", null, "guest");
        private User registeredUser = new User("u", "u@mail.com", "1234", "Gerente");

        StubUserService() {
            super(new StubUserClient());
        }

        @Override
        public UserProfileDto getCurrentUserProfile() {
            return profile;
        }

        @Override
        public User register(UserDto userDto) {
            return registeredUser;
        }

        @Override
        public Optional<User> authenticateAndGetUser(UserDto userDto) {
            return Optional.empty();
        }

        @Override
        public List<User> findAll() {
            return List.of();
        }
    }

    private static class StubUserClient implements UserClient {
        @Override
        public User create(UserDto userDto) {
            return new User(userDto.getUsername(), userDto.getEmail(), userDto.getPassword(), userDto.getRole());
        }

        @Override
        public Optional<User> authenticate(String login, String password) {
            return Optional.empty();
        }

        @Override
        public List<User> findAll() {
            return List.of();
        }
    }
}
