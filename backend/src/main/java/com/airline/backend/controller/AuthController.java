package com.airline.backend.controller;

import com.airline.backend.dto.ApiResponse;
import com.airline.backend.dto.AuthResponse;
import com.airline.backend.dto.RefreshTokenRequest;
import com.airline.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final JwtUtil jwtUtil;

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @RequestBody RefreshTokenRequest request) {
        try {
            String refreshToken = request.getRefreshToken();

            if (!jwtUtil.validateToken(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Invalid refresh token"));
            }

            String email = jwtUtil.getEmailFromToken(refreshToken);
            String role = jwtUtil.getRoleFromToken(refreshToken);
            String resolvedRole = (role != null) ? role : "USER";

            String newAccessToken = jwtUtil.generateToken(email, resolvedRole);
            String newRefreshToken = jwtUtil.generateRefreshToken(email);

            AuthResponse authResponse = new AuthResponse(
                    newAccessToken, newRefreshToken, "Bearer", resolvedRole, null);

            return ResponseEntity.ok(ApiResponse.ok("Token refreshed successfully", authResponse));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}