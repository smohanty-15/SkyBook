package com.airline.backend.controller;

import com.airline.backend.dto.ApiResponse;
import com.airline.backend.dto.BookingRequest;
import com.airline.backend.entity.Booking;
import com.airline.backend.service.BookingService;
import com.airline.backend.service.PdfService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final PdfService pdfService;

    @PostMapping
    public ResponseEntity<ApiResponse<Booking>> confirmBooking(
            @Valid @RequestBody BookingRequest request) {
        try {
            Booking booking = bookingService.confirmBooking(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok("Booking confirmed successfully", booking));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<Booking>> getBookingById(
            @PathVariable Long bookingId) {
        try {
            return ResponseEntity.ok(
                    ApiResponse.ok("Booking fetched",
                            bookingService.getBookingById(bookingId)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/pnr/{pnr}")
    public ResponseEntity<ApiResponse<Booking>> getBookingByPnr(
            @PathVariable String pnr) {
        try {
            return ResponseEntity.ok(
                    ApiResponse.ok("Booking fetched",
                            bookingService.getBookingByPnr(pnr)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByUser(
            @PathVariable Long userId) {
        try {
            return ResponseEntity.ok(
                    ApiResponse.ok("User bookings fetched",
                            bookingService.getBookingsByUserId(userId)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(
            @PathVariable Long bookingId) {
        try {
            bookingService.cancelBooking(bookingId);
            return ResponseEntity.ok(
                    ApiResponse.ok("Booking cancelled successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── PDF Download ──────────────────────────────────
    @GetMapping("/{bookingId}/ticket/pdf")
    public ResponseEntity<byte[]> downloadTicketPdf(
            @PathVariable Long bookingId) {
        try {
            Booking booking = bookingService.getBookingById(bookingId);
            byte[] pdfBytes = pdfService.generateTicketPdf(booking);
            return ResponseEntity.ok()
                    .header("Content-Disposition",
                            "attachment; filename=ticket_" + bookingId + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}