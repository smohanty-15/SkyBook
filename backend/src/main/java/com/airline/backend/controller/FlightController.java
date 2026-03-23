package com.airline.backend.controller;

import com.airline.backend.dto.ApiResponse;
import com.airline.backend.entity.Flight;
import com.airline.backend.service.FlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Flight>>> getScheduledFlights() {
        List<Flight> flights = flightService.getScheduledFlights();
        return ResponseEntity.ok(
                ApiResponse.ok("Scheduled flights fetched", flights));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Flight>>> searchFlights(
            @RequestParam String source,
            @RequestParam String destination) {
        try {
            List<Flight> flights = flightService.searchFlights(
                    source, destination);
            return ResponseEntity.ok(ApiResponse.ok("Search results", flights));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
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
}