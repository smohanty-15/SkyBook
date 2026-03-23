package com.airline.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RefreshTokenRequest {
    private String refreshToken;
}