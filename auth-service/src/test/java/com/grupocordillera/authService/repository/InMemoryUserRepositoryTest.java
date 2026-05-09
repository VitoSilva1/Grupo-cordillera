package com.grupocordillera.authService.repository;

import com.grupocordillera.authService.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class InMemoryUserRepositoryTest {

    private InMemoryUserRepository repository;

    @BeforeEach
    void setUp() {
        repository = new InMemoryUserRepository();
    }

    @Test
    void saveShouldPersistUserAndFindByUsername() {
        User user = new User("victor", "victor@mail.com", "1234", "Gerente");
        repository.save(user);

        Optional<User> found = repository.findByUsername("victor");
        assertTrue(found.isPresent());
        assertEquals("victor@mail.com", found.get().getEmail());
    }

    @Test
    void findByEmailShouldBeCaseInsensitive() {
        User user = new User("victor", "victor@mail.com", "1234", "Gerente");
        repository.save(user);

        Optional<User> found = repository.findByEmail("Victor@Mail.Com");
        assertTrue(found.isPresent());
        assertEquals("victor", found.get().getUsername());
    }

    @Test
    void existsMethodsShouldReportStoredUsers() {
        User user = new User("victor", "victor@mail.com", "1234", "Gerente");
        repository.save(user);

        assertTrue(repository.existsByUsername("victor"));
        assertTrue(repository.existsByEmail("victor@mail.com"));
        assertFalse(repository.existsByUsername("otro"));
    }

    @Test
    void findAllShouldReturnAllSavedUsers() {
        repository.save(new User("victor", "victor@mail.com", "1234", "Gerente"));
        repository.save(new User("carolina", "carolina@mail.com", "1234", "Supervisor"));

        List<User> users = repository.findAll();
        assertEquals(2, users.size());
    }
}
