package com.airline.backend.service;

import com.airline.backend.dto.BookingRequest;
import com.airline.backend.entity.Booking;
import com.airline.backend.entity.FlightStatus;
import java.util.List;

public interface BookingService {
    Booking confirmBooking(BookingRequest request);
    Booking getBookingById(Long bookingId);
    Booking getBookingByPnr(String pnr);
    List<Booking> getAllBookings();
    List<Booking> getBookingsByUserId(Long userId);
    void cancelBooking(Long bookingId);
    void updateBookingStatusByFlightStatus(Long flightId, FlightStatus flightStatus);
    List<Booking> getBookingsByFlightId(Long flightId);
}