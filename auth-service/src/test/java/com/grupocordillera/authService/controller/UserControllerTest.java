package com.grupocordillera.authService.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.grupocordillera.authService.dto.UserDto;
import com.grupocordillera.authService.dto.UserProfileDto;
import com.grupocordillera.authService.model.User;
import com.grupocordillera.authService.service.UserService;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;

import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @Test
    void healthShouldReturnUpStatus() throws Exception {

        mockMvc.perform(get("/api/auth/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("auth-service"));
    }

    @Test
    void getUsersMeShouldReturnCurrentUserProfile() throws Exception {

        UserProfileDto profile = new UserProfileDto(
                "mock-user",
                "Mock User",
                "Supervisor",
                "mock@mail.com",
                "mockuser");

        when(userService.getCurrentUserProfile())
                .thenReturn(profile);

        mockMvc.perform(get("/api/auth/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("mock-user"))
                .andExpect(jsonPath("$.role").value("Supervisor"));
    }

    @Test
    void getMockUserShouldReturnProfileForValidRole() throws Exception {

        UserProfileDto profile = new UserProfileDto(
                "mock-vendedor",
                "Daniela Soto",
                "Vendedor",
                "daniela.soto@grupocordillera.cl",
                "dsoto");

        when(userService.getMockUserProfile("vendedor"))
                .thenReturn(profile);

        mockMvc.perform(
                get("/api/auth/users/mock")
                        .param("role", "vendedor"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("dsoto"))
                .andExpect(jsonPath("$.role").value("Vendedor"));
    }

    @Test
    void getMockUserShouldReturnBadRequestForInvalidRole() throws Exception {

        when(userService.getMockUserProfile("admin"))
                .thenThrow(new IllegalArgumentException(
                        "El role debe ser Gerente, Supervisor o Vendedor"));

        mockMvc.perform(
                get("/api/auth/users/mock")
                        .param("role", "admin"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error")
                        .value("El role debe ser Gerente, Supervisor o Vendedor"));
    }

    @Test
    void registerShouldReturnCreatedResponse() throws Exception {

        UserDto request = new UserDto(
                "victor@mail.com",
                "victor",
                "1234",
                "Gerente");

        User user = new User(
                "victor",
                "victor@mail.com",
                "1234",
                "Gerente");

        when(userService.register(any(UserDto.class)))
                .thenReturn(user);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message")
                        .value("Usuario registrado correctamente"))
                .andExpect(jsonPath("$.email")
                        .value("victor@mail.com"));
    }

    @Test
    void loginShouldReturnUnauthorizedForInvalidCredentials() throws Exception {

        UserDto request = new UserDto(
                null,
                "victor",
                "wrong",
                null);

        when(userService.authenticate(any(UserDto.class)))
                .thenReturn(false);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error")
                        .value("Credenciales invalidas"));
    }
}