import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-4">
      <h3 class="page-title">📋 My Bookings</h3>

      <div class="alert alert-info" *ngIf="bookings.length === 0">
        No bookings found. Start booking your flights!
      </div>

      <div class="table-responsive" *ngIf="bookings.length > 0">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>PNR</th>
              <th>Flight</th>
              <th>Route</th>
              <th>Date</th>
              <th>Seats</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let b of bookings">
              <td><strong>{{ b.pnr }}</strong></td>
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
              <td>
                <div class="d-flex gap-1">
                  <button class="btn btn-sm btn-outline-primary"
                    (click)="downloadPdf(b.bookingId)"
                    *ngIf="b.bookingStatus === 'CONFIRMED'">
                    📄 PDF
                  </button>
                  <button class="btn btn-sm btn-outline-danger"
                    (click)="cancelBooking(b.bookingId)"
                    *ngIf="b.bookingStatus === 'CONFIRMED'">
                    Cancel
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class BookingHistoryComponent implements OnInit {
  bookings: any[] = [];

  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.bookingService.getBookingsByUser(userId).subscribe((res: any) => {
        this.bookings = res.data || [];
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'CONFIRMED': return 'badge-confirmed';
      case 'CANCELLED': return 'badge-cancelled';
      case 'FLIGHTCANCELLED': return 'badge-flightcancelled';
      default: return '';
    }
  }

  cancelBooking(bookingId: number): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(bookingId).subscribe((res: any) => {
        if (res.success) {
          alert('Booking cancelled successfully');
          this.ngOnInit();
        }
      });
    }
  }

  downloadPdf(bookingId: number): void {
    this.bookingService.downloadTicketPdf(bookingId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket_${bookingId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}