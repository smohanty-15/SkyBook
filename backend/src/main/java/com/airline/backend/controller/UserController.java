package com.airline.backend.controller;

import com.airline.backend.dto.*;
import com.airline.backend.entity.User;
import com.airline.backend.security.JwtUtil;
import com.airline.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(
            @Valid @RequestBody RegisterUserRequest request) {
        try {
            User user = userService.registerUser(request);
            user.setPassword(null);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok("User registered successfully", user));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        try {
            User user = userService.loginUser(
                    request.getEmail(), request.getPassword());
            user.setPassword(null);

            String accessToken  = jwtUtil.generateToken(user.getEmail(), "USER");
            String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

            AuthResponse authResponse = new AuthResponse(
                    accessToken, refreshToken, "Bearer", "USER", user);

            return ResponseEntity.ok(ApiResponse.ok("Login successful", authResponse));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            user.setPassword(null);
            return ResponseEntity.ok(ApiResponse.ok("User fetched", user));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<ApiResponse<Void>> updateProfile(
            @PathVariable Long id,
            @RequestBody RegisterUserRequest request) {
        try {
            userService.updateProfile(id, request);
            return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {
        try {
            userService.forgotPassword(request.getEmail());
            return ResponseEntity.ok(ApiResponse.ok("Password reset email sent"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @RequestBody ResetPasswordRequest request) {
        try {
            userService.resetPassword(
                    request.getToken(), request.getNewPassword());
            return ResponseEntity.ok(ApiResponse.ok("Password reset successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}