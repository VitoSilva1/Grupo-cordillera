package com.grupocordillera.authService.dto;

public record UserProfileDto(
        String id,
        String name,
        String role,
        String email,
        String username
) {
}
