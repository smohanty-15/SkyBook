package com.airline.backend.controller;

import com.airline.backend.dto.ApiResponse;
import com.airline.backend.entity.Flight;
import com.airline.backend.service.BookingService;
import com.airline.backend.service.FlightService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;
    private final BookingService bookingService;

    // Get all scheduled flights
    @GetMapping
    public ResponseEntity<ApiResponse<List<Flight>>> getScheduledFlights() {
        return ResponseEntity.ok(ApiResponse.ok(
                "Scheduled flights", flightService.getScheduledFlights()));
    }

    // Search by source & destination
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Flight>>> searchFlights(
            @RequestParam String source,
            @RequestParam String destination) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Search results",
                flightService.searchFlights(source, destination)));
    }

    // Search by source, destination and date
    @GetMapping("/search/date")
    public ResponseEntity<ApiResponse<List<Flight>>> searchFlightsByDate(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Search results by date",
                flightService.searchFlightsByDate(source, destination, date)));
    }

    // Get flights by date only
    @GetMapping("/date")
    public ResponseEntity<ApiResponse<List<Flight>>> getFlightsByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Flights on date",
                flightService.getFlightsByDate(date)));
    }

    // Paginated flights with sorting
    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<Page<Flight>>> getFlightsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "price") String sortBy) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Paged flights",
                flightService.getScheduledFlightsPaged(page, size, sortBy)));
    }

    // Get flight by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Flight>> getFlightById(
            @PathVariable Long id) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(
                    "Flight fetched", flightService.getFlightById(id)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // Get booking count for a flight
    @GetMapping("/{id}/booking-count")
    public ResponseEntity<ApiResponse<Integer>> getBookingCount(
            @PathVariable Long id) {
        try {
            Flight flight = flightService.getFlightById(id);
            int count = bookingService.getBookingsByFlightId(id).size();
            return ResponseEntity.ok(ApiResponse.ok(
                    "Booking count for flight", count));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}