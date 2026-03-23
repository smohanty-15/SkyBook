import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-pnr-check',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card p-4 shadow">
            <h4 class="text-primary mb-4 text-center">🔍 Check PNR Status</h4>
            <div class="mb-3">
              <label class="form-label">Enter PNR Number</label>
              <input type="text" class="form-control"
                [(ngModel)]="pnr" placeholder="Enter your PNR">
            </div>
            <button class="btn btn-primary w-100"
              (click)="checkPnr()">Check Status</button>

            <!-- Result -->
            <div class="card mt-4 p-3" *ngIf="booking">
              <h6 class="text-primary">Booking Details</h6>
              <p><strong>PNR:</strong> {{ booking.pnr }}</p>
              <p><strong>Status:</strong>
                <span [class]="getStatusClass(booking.bookingStatus)">
                  {{ booking.bookingStatus }}
                </span>
              </p>
              <p><strong>Passenger:</strong> {{ booking.user?.name }}</p>
              <p><strong>Flight:</strong> {{ booking.flight?.flightNumber }}</p>
              <p><strong>Route:</strong>
                {{ booking.flight?.source }} → {{ booking.flight?.destination }}
              </p>
              <p><strong>Date:</strong> {{ booking.flight?.departureDate }}</p>
              <p><strong>Departure:</strong>
                {{ booking.flight?.departureTime | slice:11:16 }}
              </p>
              <p><strong>Seats:</strong> {{ booking.noOfSeat }}</p>
            </div>

            <div class="alert alert-danger mt-3" *ngIf="errorMsg">
              {{ errorMsg }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PnrCheckComponent {
  pnr = '';
  booking: any = null;
  errorMsg = '';

  constructor(private bookingService: BookingService) {}

  checkPnr(): void {
    if (!this.pnr) return;
    this.errorMsg = '';
    this.booking = null;

    this.bookingService.checkPnr(this.pnr).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.booking = res.data;
        } else {
          this.errorMsg = res.message;
        }
      },
      error: () => {
        this.errorMsg = 'No booking found with this PNR';
      }
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