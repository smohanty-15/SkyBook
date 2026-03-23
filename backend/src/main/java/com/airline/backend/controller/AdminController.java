package com.airline.backend.controller;

import com.airline.backend.dto.ApiResponse;
import com.airline.backend.dto.LoginRequest;
import com.airline.backend.entity.Admin;
import com.airline.backend.entity.Booking;
import com.airline.backend.entity.Flight;
import com.airline.backend.service.AdminService;
import com.airline.backend.service.BookingService;
import com.airline.backend.service.FlightService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final FlightService flightService;
    private final BookingService bookingService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Admin>> register(
            @Valid @RequestBody Admin admin) {
        try {
            Admin saved = adminService.registerAdmin(admin);
            saved.setPassword(null);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok("Admin registered successfully", saved));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Admin>> login(
            @Valid @RequestBody LoginRequest request) {
        try {
            Admin admin = adminService.loginAdmin(
                    request.getEmail(), request.getPassword());
            admin.setPassword(null);
            return ResponseEntity.ok(
                    ApiResponse.ok("Admin login successful", admin));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/flights")
    public ResponseEntity<ApiResponse<Flight>> addFlight(
            @Valid @RequestBody Flight flight) {
        try {
            Flight saved = flightService.addFlight(flight);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok("Flight added successfully", saved));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/flights/{id}")
    public ResponseEntity<ApiResponse<Flight>> editFlight(
            @PathVariable Long id,
            @Valid @RequestBody Flight flight) {
        try {
            Flight updated = flightService.editFlight(id, flight);
            bookingService.updateBookingStatusByFlightStatus(
                    id, updated.getFlightStatus());
            return ResponseEntity.ok(
                    ApiResponse.ok("Flight updated successfully", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/flights")
    public ResponseEntity<ApiResponse<List<Flight>>> getAllFlights() {
        List<Flight> flights = flightService.getAllFlights();
        return ResponseEntity.ok(ApiResponse.ok("All flights fetched", flights));
    }

    @GetMapping("/flights/{id}")
    public ResponseEntity<ApiResponse<Flight>> getFlightById(
            @PathVariable Long id) {
        try {
            Flight flight = flightService.getFlightById(id);
            return ResponseEntity.ok(ApiResponse.ok("Flight fetched", flight));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<Booking>>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(
                ApiResponse.ok("All bookings fetched", bookings));
    }
}