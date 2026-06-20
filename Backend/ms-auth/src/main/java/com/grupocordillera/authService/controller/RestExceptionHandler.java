package com.grupocordillera.authservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.RestClientException;

import java.time.Instant;

@RestControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleBadRequest(IllegalArgumentException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiError.of("BAD_REQUEST", exception.getMessage()));
    }

    @ExceptionHandler(RestClientException.class)
    public ResponseEntity<ApiError> handleDependencyFailure(RestClientException exception) {
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(ApiError.of("DEPENDENCY_FAILURE", exception.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpected(Exception exception) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiError.of("INTERNAL_ERROR", "Unexpected service error"));
    }

    public record ApiError(String code, String message, Instant timestamp) {
        static ApiError of(String code, String message) {
            return new ApiError(code, message, Instant.now());
        }
    }
}
