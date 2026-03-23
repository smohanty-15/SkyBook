package com.airline.backend.service;

import com.airline.backend.entity.Flight;
import java.util.List;

public interface FlightService {
    Flight addFlight(Flight flight);
    Flight editFlight(Long id, Flight flight);
    Flight getFlightById(Long id);
    List<Flight> getAllFlights();
    List<Flight> getScheduledFlights();
    List<Flight> searchFlights(String source, String destination);
}