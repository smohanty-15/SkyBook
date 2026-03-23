import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-all-bookings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-4">
      <h3 class="page-title">📋 All Bookings</h3>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>PNR</th>
              <th>User</th>
              <th>Flight</th>
              <th>Route</th>
              <th>Date</th>
              <th>Seats</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let b of bookings">
              <td>{{ b.bookingId }}</td>
              <td><strong>{{ b.pnr }}</strong></td>
              <td>{{ b.user?.name }}</td>
              <td>{{ b.flight?.flightNumber }}</td>
              <td>{{ b.flight?.source }} → {{ b.flight?.destination }}</td>
              <td>{{ b.flight?.departureDate }}</td>
              <td>{{ b.noOfSeat }}</td>
              <td>₹{{ b.flight?.price * b.noOfSeat }}</td>
              <td>
                <span [class]="getStatusClass(b.bookingStatus)">
                  {{ b.bookingStatus }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AllBookingsComponent implements OnInit {
  bookings: any[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.getAllBookings().subscribe((res: any) => {
      this.bookings = res.data || [];
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'CONFIRMED': return 'badge-confirmed';
      case 'CANCELLED': return 'badge-cancelled';
      default: return 'badge-flightcancelled';
    }
  }
}