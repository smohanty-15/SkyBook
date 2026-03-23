package com.airline.backend.service;

import com.airline.backend.entity.Booking;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendBookingConfirmation(Booking booking) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(booking.getUser().getEmail());
            message.setSubject("✈️ SkyBook - Booking Confirmed! PNR: "
                    + booking.getPnr());
            message.setText(
                    "Dear " + booking.getUser().getName() + ",\n\n" +
                            "Your booking is CONFIRMED!\n\n" +
                            "─────────────────────────\n" +
                            "PNR         : " + booking.getPnr() + "\n" +
                            "Flight No   : " + booking.getFlight().getFlightNumber() + "\n" +
                            "From        : " + booking.getFlight().getSource() + "\n" +
                            "To          : " + booking.getFlight().getDestination() + "\n" +
                            "Date        : " + booking.getFlight().getDepartureDate() + "\n" +
                            "Departure   : " + booking.getFlight().getDepartureTime() + "\n" +
                            "Seats       : " + booking.getNoOfSeat() + "\n" +
                            "Seat Nos    : " + booking.getFromSeatNo()
                            + " - " + booking.getToSeatNo() + "\n" +
                            "Total Price : ₹" + (booking.getFlight().getPrice()
                            * booking.getNoOfSeat()) + "\n" +
                            "─────────────────────────\n\n" +
                            "Thank you for choosing SkyBook! ✈️\n\n" +
                            "Team SkyBook"
            );
            mailSender.send(message);
            log.info("Booking confirmation sent to: {}",
                    booking.getUser().getEmail());
        } catch (Exception e) {
            log.error("Failed to send booking email: {}", e.getMessage());
        }
    }

    @Async
    public void sendCancellationEmail(Booking booking) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(booking.getUser().getEmail());
            message.setSubject("❌ SkyBook - Booking Cancelled | PNR: "
                    + booking.getPnr());
            message.setText(
                    "Dear " + booking.getUser().getName() + ",\n\n" +
                            "Your booking has been CANCELLED.\n\n" +
                            "─────────────────────────\n" +
                            "PNR       : " + booking.getPnr() + "\n" +
                            "Flight No : " + booking.getFlight().getFlightNumber() + "\n" +
                            "From      : " + booking.getFlight().getSource() + "\n" +
                            "To        : " + booking.getFlight().getDestination() + "\n" +
                            "─────────────────────────\n\n" +
                            "We hope to see you again!\n\n" +
                            "Team SkyBook"
            );
            mailSender.send(message);
            log.info("Cancellation email sent to: {}",
                    booking.getUser().getEmail());
        } catch (Exception e) {
            log.error("Failed to send cancellation email: {}", e.getMessage());
        }
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String firstName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("🎉 Welcome to SkyBook!");
            message.setText(
                    "Dear " + firstName + ",\n\n" +
                            "Welcome to SkyBook!\n\n" +
                            "Your account has been created successfully.\n" +
                            "Start booking your flights today!\n\n" +
                            "Team SkyBook ✈️"
            );
            mailSender.send(message);
            log.info("Welcome email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send welcome email: {}", e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String toEmail,
                                       String firstName,
                                       String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("🔑 SkyBook - Password Reset Request");
            message.setText(
                    "Dear " + firstName + ",\n\n" +
                            "You requested a password reset.\n\n" +
                            "Your reset token:\n" +
                            token + "\n\n" +
                            "This token is valid for 30 minutes only.\n\n" +
                            "If you did not request this, ignore this email.\n\n" +
                            "Team SkyBook"
            );
            mailSender.send(message);
            log.info("Password reset email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email: {}", e.getMessage());
        }
    }

    @Async
    public void sendFlightCancelledAlert(String toEmail,
                                         String firstName,
                                         String flightNumber,
                                         String pnr) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("⚠️ SkyBook - Flight " + flightNumber + " Cancelled");
            message.setText(
                    "Dear " + firstName + ",\n\n" +
                            "Flight " + flightNumber + " has been CANCELLED.\n\n" +
                            "Your PNR: " + pnr + "\n\n" +
                            "We apologize for the inconvenience.\n\n" +
                            "Team SkyBook"
            );
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send flight alert email: {}", e.getMessage());
        }
    }
}