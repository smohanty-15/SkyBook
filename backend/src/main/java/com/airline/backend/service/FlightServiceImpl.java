package com.airline.backend.service;

import com.airline.backend.entity.Flight;
import com.airline.backend.entity.FlightStatus;
import com.airline.backend.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FlightServiceImpl implements FlightService {

    private final FlightRepository flightRepository;

    @Override
    public Flight addFlight(Flight flight) {
        log.info("Adding flight: {}", flight.getFlightNumber());
        return flightRepository.save(flight);
    }

    @Override
    public Flight editFlight(Long id, Flight updatedFlight) {
        Flight existing = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Flight not found: " + id));
        existing.setFlightNumber(updatedFlight.getFlightNumber());
        existing.setDepartureDate(updatedFlight.getDepartureDate());
        existing.setSource(updatedFlight.getSource());
        existing.setDestination(updatedFlight.getDestination());
        existing.setDepartureTime(updatedFlight.getDepartureTime());
        existing.setArrivalTime(updatedFlight.getArrivalTime());
        existing.setPrice(updatedFlight.getPrice());
        existing.setAvailableSeats(updatedFlight.getAvailableSeats());
        existing.setFlightStatus(updatedFlight.getFlightStatus());
        log.info("Updated flight id: {}", id);
        return flightRepository.save(existing);
    }

    @Override
    public Flight getFlightById(Long id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Flight not found: " + id));
    }

    @Override
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    @Override
    public List<Flight> getScheduledFlights() {
        return flightRepository.findByFlightStatus(FlightStatus.SCHEDULED);
    }

    @Override
    public List<Flight> searchFlights(String source, String destination) {
        return flightRepository
                .findBySourceIgnoreCaseAndDestinationIgnoreCaseAndFlightStatus(
                        source, destination, FlightStatus.SCHEDULED);
    }

    @Override
    public List<Flight> searchFlightsByDate(String source,
                                            String destination,
                                            LocalDate date) {
        return flightRepository
                .findBySourceIgnoreCaseAndDestinationIgnoreCaseAndDepartureDateAndFlightStatus(
                        source, destination, date, FlightStatus.SCHEDULED);
    }

    @Override
    public List<Flight> getFlightsByDate(LocalDate date) {
        return flightRepository.findByDepartureDateAndFlightStatus(
                date, FlightStatus.SCHEDULED);
    }

    @Override
    public Page<Flight> getScheduledFlightsPaged(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.ASC, sortBy));
        return flightRepository.findByFlightStatus(
                FlightStatus.SCHEDULED, pageable);
    }
}