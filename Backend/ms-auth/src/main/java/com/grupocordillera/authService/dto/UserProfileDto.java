package com.grupocordillera.authservice.dto;

public record UserProfileDto(
        String id,
        String name,
        String role,
        String email,
        String username
) {
}
