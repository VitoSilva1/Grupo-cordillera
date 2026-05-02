package com.grupocordillera.authService.repository;

import com.grupocordillera.authService.model.User;
import org.springframework.stereotype.Repository;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Repository
public class InMemoryUserRepository {

    private final ConcurrentMap<String, User> users = new ConcurrentHashMap<>();

    @PostConstruct
    public void initMockUsers() {
        save(new User("gerente", "gerente@cordillera.cl", "1234", "Gerente"));
        save(new User("supervisor", "supervisor@cordillera.cl", "1234", "Supervisor"));
        save(new User("vendedor", "vendedor@cordillera.cl", "1234", "Vendedor"));
    }

    public User save(User user) {
        users.put(user.getUsername(), user);
        return user;
    }

    public Optional<User> findByUsername(String username) {
        return Optional.ofNullable(users.get(username));
    }

    public Optional<User> findByEmail(String email) {
        return users.values().stream()
                .filter(user -> user.getEmail().equalsIgnoreCase(email))
                .findFirst();
    }

    public boolean existsByUsername(String username) {
        return users.containsKey(username);
    }

    public boolean existsByEmail(String email) {
        return users.values().stream()
                .anyMatch(user -> user.getEmail().equalsIgnoreCase(email));
    }

    public List<User> findAll() {
        return new ArrayList<>(users.values());
    }
}
