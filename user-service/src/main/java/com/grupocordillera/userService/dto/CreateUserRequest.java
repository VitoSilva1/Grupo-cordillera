package com.grupocordillera.userService.dto;

public record CreateUserRequest(
        String username,
        String email,
        String password,
        String firstName,
        String lastName,
        String role
) {
}
