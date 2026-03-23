package com.airline.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingRequest {

    @NotNull(message = "Flight ID is required")
    private Long flightId;

    @NotNull(message = "User ID is required")
    private Long userId;

    @Min(value = 1, message = "Minimum 1 seat required")
    @Max(value = 4, message = "Maximum 4 seats allowed")
    private int noOfSeat;

    private String passenger2;
    private String passenger3;
    private String passenger4;
}