package com.airline.backend.repository;

import com.airline.backend.entity.Flight;
import com.airline.backend.entity.FlightStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    List<Flight> findByFlightStatus(FlightStatus status);

    List<Flight> findBySourceIgnoreCaseAndDestinationIgnoreCase(
            String source, String destination);

    List<Flight> findBySourceIgnoreCaseAndDestinationIgnoreCaseAndFlightStatus(
            String source, String destination, FlightStatus status);

    // Filter by date
    List<Flight> findByDepartureDateAndFlightStatus(
            LocalDate date, FlightStatus status);

    // Filter by source, destination and date
    List<Flight> findBySourceIgnoreCaseAndDestinationIgnoreCaseAndDepartureDateAndFlightStatus(
            String source, String destination,
            LocalDate date, FlightStatus status);

    // Pagination
    Page<Flight> findByFlightStatus(FlightStatus status, Pageable pageable);
}