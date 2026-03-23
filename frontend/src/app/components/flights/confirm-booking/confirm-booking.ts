import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-confirm-booking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-md-7">
          <div class="card p-4 shadow">
            <h4 class="text-primary mb-4">✅ Confirm Booking</h4>

            <div *ngIf="bookingData">
              <div class="card bg-light p-3 mb-3">
                <h6>Flight Details</h6>
                <p><strong>Flight:</strong> {{ bookingData.flight.flightNumber }}</p>
                <p><strong>Route:</strong>
                  {{ bookingData.flight.source }} → {{ bookingData.flight.destination }}
                </p>
                <p><strong>Date:</strong> {{ bookingData.flight.departureDate }}</p>
                <p><strong>Departure:</strong>
                  {{ bookingData.flight.departureTime | slice:11:16 }}
                </p>
              </div>

              <div class="card bg-light p-3 mb-3">
                <h6>Booking Summary</h6>
                <p><strong>Seats:</strong> {{ bookingData.noOfSeat }}</p>
                <p><strong>Total Price:</strong>
                  <span class="text-primary fs-5">₹{{ bookingData.totalPrice }}</span>
                </p>
              </div>

              <div class="alert alert-success" *ngIf="successMsg">
                ✅ {{ successMsg }}
              </div>
              <div class="alert alert-danger" *ngIf="errorMsg">
                ❌ {{ errorMsg }}
              </div>

              <div class="d-flex gap-2">
                <button class="btn btn-secondary"
                  (click)="goBack()">Back</button>
                <button class="btn btn-success flex-grow-1"
                  (click)="confirmBooking()" [disabled]="loading">
                  {{ loading ? 'Booking...' : '✅ Confirm Booking' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConfirmBookingComponent implements OnInit {
  bookingData: any = null;
  loading = false;
  successMsg = '';
  errorMsg = '';

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const data = sessionStorage.getItem('pendingBooking');
    if (data) {
      this.bookingData = JSON.parse(data);
    } else {
      this.router.navigate(['/flights']);
    }
  }

  confirmBooking(): void {
    this.loading = true;
    const request = {
      flightId: this.bookingData.flightId,
      userId: this.bookingData.userId,
      noOfSeat: this.bookingData.noOfSeat,
      passenger2: this.bookingData.passenger2,
      passenger3: this.bookingData.passenger3,
      passenger4: this.bookingData.passenger4
    };

    this.bookingService.confirmBooking(request).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.successMsg = 'Booking confirmed! PNR: ' + res.data.pnr;
          sessionStorage.removeItem('pendingBooking');
          setTimeout(() => this.router.navigate(['/my-bookings']), 2000);
        } else {
          this.errorMsg = res.message;
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Booking failed';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/flights']);
  }
}