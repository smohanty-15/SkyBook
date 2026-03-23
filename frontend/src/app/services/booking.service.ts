import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  confirmBooking(bookingData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings`, bookingData);
  }

  getBookingById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings/${id}`);
  }

  getBookingsByUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings/user/${userId}`);
  }

  checkPnr(pnr: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings/pnr/${pnr}`);
  }

  cancelBooking(bookingId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/bookings/${bookingId}/cancel`, {});
  }

  downloadTicketPdf(bookingId: number): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/bookings/${bookingId}/ticket/pdf`,
      { responseType: 'blob' });
  }

  // Admin
  getAllBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/bookings`);
  }
}