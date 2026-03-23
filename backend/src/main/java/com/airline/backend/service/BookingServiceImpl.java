package com.airline.backend.service;

import com.airline.backend.dto.BookingRequest;
import com.airline.backend.entity.*;
import com.airline.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Booking confirmBooking(BookingRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException(
                        "User not found with id: " + request.getUserId()));

        Flight flight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new RuntimeException(
                        "Flight not found with id: " + request.getFlightId()));

        if (flight.getFlightStatus() != FlightStatus.SCHEDULED) {
            throw new RuntimeException("Flight is not available for booking");
        }

        if (flight.getAvailableSeats() < request.getNoOfSeat()) {
            throw new RuntimeException("Not enough seats available. Only "
                    + flight.getAvailableSeats() + " seats left.");
        }

        int toSeat = flight.getAvailableSeats();
        int fromSeat = toSeat - request.getNoOfSeat() + 1;

        flight.setAvailableSeats(flight.getAvailableSeats() - request.getNoOfSeat());
        flightRepository.save(flight);

        String pnr = generateUniquePnr();

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setFlight(flight);
        booking.setNoOfSeat(request.getNoOfSeat());
        booking.setFromSeatNo(fromSeat);
        booking.setToSeatNo(toSeat);
        booking.setPassenger2(request.getPassenger2());
        booking.setPassenger3(request.getPassenger3());
        booking.setPassenger4(request.getPassenger4());
        booking.setPnr(pnr);
        booking.setBookingStatus(BookingStatus.CONFIRMED);

        log.info("Booking confirmed for user: {} on flight: {} PNR: {}",
                user.getEmail(), flight.getFlightNumber(), pnr);

        return bookingRepository.save(booking);
    }

    @Override
    public Booking getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException(
                        "Booking not found with id: " + bookingId));
    }

    @Override
    public Booking getBookingByPnr(String pnr) {
        return bookingRepository.findByPnr(pnr)
                .orElseThrow(() -> new RuntimeException(
                        "No booking found with PNR: " + pnr));
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public List<Booking> getBookingsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException(
                        "User not found with id: " + userId));
        return bookingRepository.findByUser(user);
    }

    @Override
    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException(
                        "Booking not found with id: " + bookingId));

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        Flight flight = booking.getFlight();
        flight.setAvailableSeats(flight.getAvailableSeats() + booking.getNoOfSeat());
        flightRepository.save(flight);

        booking.setBookingStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        log.info("Booking cancelled: {}", bookingId);
    }

    @Override
    @Transactional
    public void updateBookingStatusByFlightStatus(Long flightId, FlightStatus flightStatus) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException(
                        "Flight not found with id: " + flightId));

        List<Booking> bookings = bookingRepository.findByFlight(flight);
        for (Booking booking : bookings) {
            if (flightStatus == FlightStatus.CANCELLED
                    && booking.getBookingStatus() == BookingStatus.CONFIRMED) {
                booking.setBookingStatus(BookingStatus.FLIGHTCANCELLED);
                bookingRepository.save(booking);
            } else if (flightStatus == FlightStatus.SCHEDULED
                    && booking.getBookingStatus() == BookingStatus.FLIGHTCANCELLED) {
                booking.setBookingStatus(BookingStatus.CONFIRMED);
                bookingRepository.save(booking);
            }
        }
        log.info("Updated booking statuses for flight: {} status: {}",
                flightId, flightStatus);
    }

    private String generateUniquePnr() {
        String pnr;
        do {
            pnr = UUID.randomUUID().toString()
                    .replace("-", "")
                    .substring(0, 10)
                    .toUpperCase();
        } while (bookingRepository.findByPnr(pnr).isPresent());
        return pnr;
    }
}