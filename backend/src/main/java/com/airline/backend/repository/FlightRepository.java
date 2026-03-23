package com.airline.backend.repository;

import com.airline.backend.entity.Flight;
import com.airline.backend.entity.FlightStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    List<Flight> findByFlightStatus(FlightStatus status);

    List<Flight> findBySourceIgnoreCaseAndDestinationIgnoreCase(
            String source, String destination);

    List<Flight> findBySourceIgnoreCaseAndDestinationIgnoreCaseAndFlightStatus(
            String source, String destination, FlightStatus status);
}

