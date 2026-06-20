package com.grupocordillera.userservice.dto;

import com.grupocordillera.userservice.model.User;

public record AuthenticatedUserResponse(
        Long id,
        String username,
        String email,
        String firstName,
        String lastName,
        String role
) {
    public static AuthenticatedUserResponse from(User user) {
        return new AuthenticatedUserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole()
        );
    }
}
