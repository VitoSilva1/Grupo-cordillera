package com.grupocordillera.authservice.client;

import com.grupocordillera.authservice.dto.UserDto;
import com.grupocordillera.authservice.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class HttpUserClient implements UserClient {

    private final RestClient restClient;

    public HttpUserClient(@Value("${user-service.url}") String userServiceUrl) {
        this.restClient = RestClient.builder().baseUrl(userServiceUrl).build();
    }

    @Override
    public User create(UserDto userDto) {
        try {
            return restClient.post()
                    .body(new CreateUserRequest(
                            userDto.getUsername(),
                            userDto.getEmail(),
                            userDto.getPassword(),
                            fallback(userDto.getFirstName(), userDto.getUsername()),
                            fallback(userDto.getLastName(), "Cordillera"),
                            userDto.getRole()
                    ))
                    .retrieve()
                    .body(User.class);
        } catch (HttpClientErrorException ex) {
            throw new IllegalArgumentException(errorMessage(ex));
        }
    }

    @Override
    public Optional<User> authenticate(String login, String password) {
        try {
            User user = restClient.post()
                    .uri("/authenticate")
                    .body(new AuthenticateUserRequest(login, password))
                    .retrieve()
                    .body(User.class);
            return Optional.ofNullable(user);
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode().equals(HttpStatus.UNAUTHORIZED)) {
                return Optional.empty();
            }
            throw new IllegalArgumentException(errorMessage(ex));
        }
    }

    @Override
    public List<User> findAll() {
        List<User> users = restClient.get()
                .retrieve()
                .body(new ParameterizedTypeReference<List<User>>() {});
        return users == null ? List.of() : users;
    }

    private String fallback(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }

    private String errorMessage(HttpClientErrorException ex) {
        try {
            Map<?, ?> payload = ex.getResponseBodyAs(Map.class);
            Object error = payload.get("error");
            if (error instanceof String message && !message.isBlank()) {
                return message;
            }
        } catch (RuntimeException ignored) {
            // Uses a default message when upstream response is not the expected JSON shape.
        }
        return "Error consultando user-service";
    }

    private record CreateUserRequest(String username, String email, String password, String firstName, String lastName, String role) {}
    private record AuthenticateUserRequest(String login, String password) {}
}
