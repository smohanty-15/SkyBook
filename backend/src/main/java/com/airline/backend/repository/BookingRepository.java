package com.airline.backend.repository;

import com.airline.backend.entity.Booking;
import com.airline.backend.entity.BookingStatus;
import com.airline.backend.entity.Flight;
import com.airline.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByFlight(Flight flight);
    Optional<Booking> findByPnr(String pnr);
    List<Booking> findByUserAndBookingStatus(User user, BookingStatus status);
}

