package com.airline.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ForgotPasswordRequest {
    private String email;
}