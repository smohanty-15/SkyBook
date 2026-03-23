package com.airline.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResetPasswordRequest {
    private String token;
    private String newPassword;
}