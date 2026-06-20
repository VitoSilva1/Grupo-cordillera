package com.grupocordillera.authservice.client;

import com.grupocordillera.authservice.dto.UserDto;
import com.grupocordillera.authservice.model.User;

import java.util.List;
import java.util.Optional;

public interface UserClient {
    User create(UserDto userDto);
    Optional<User> authenticate(String login, String password);
    List<User> findAll();
}
