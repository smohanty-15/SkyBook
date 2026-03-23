import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Flight } from '../models/flight';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllFlights(): Observable<any> {
    return this.http.get(`${this.apiUrl}/flights`);
  }

  searchFlights(source: string, destination: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/flights/search?source=${source}&destination=${destination}`);
  }

  searchFlightsByDate(source: string,
                      destination: string,
                      date: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/flights/search/date?source=${source}&destination=${destination}&date=${date}`);
  }

  getFlightById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/flights/${id}`);
  }

  getFlightsPaged(page: number, size: number, sortBy: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/flights/paged?page=${page}&size=${size}&sortBy=${sortBy}`);
  }

  // Admin
  addFlight(flight: Flight): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/flights`, flight);
  }

  editFlight(id: number, flight: Flight): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/flights/${id}`, flight);
  }

  getAllFlightsAdmin(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/flights`);
  }

  getBookingCount(flightId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/flights/${flightId}/booking-count`);
  }
}