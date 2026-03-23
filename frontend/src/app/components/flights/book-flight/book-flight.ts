import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../../services/flight.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-book-flight',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card p-4 shadow">
            <h4 class="text-primary mb-4">🎟️ Book Flight</h4>

            <!-- Flight Info -->
            <div class="card bg-light p-3 mb-4" *ngIf="flight">
              <div class="row">
                <div class="col-md-6">
                  <p><strong>Flight:</strong> {{ flight.flightNumber }}</p>
                  <p><strong>From:</strong> {{ flight.source }}</p>
                  <p><strong>Date:</strong> {{ flight.departureDate }}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>To:</strong> {{ flight.destination }}</p>
                  <p><strong>Price/Seat:</strong> ₹{{ flight.price }}</p>
                  <p><strong>Available:</strong> {{ flight.availableSeats }}</p>
                </div>
              </div>
            </div>

            <!-- Booking Form -->
            <div class="mb-3">
              <label class="form-label">Number of Seats (Max 4)</label>
              <select class="form-select" [(ngModel)]="noOfSeat"
                (change)="updateTotal()">
                <option [value]="1">1</option>
                <option [value]="2">2</option>
                <option [value]="3">3</option>
                <option [value]="4">4</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Passenger 1 (You)</label>
              <input type="text" class="form-control"
                [value]="user?.name" readonly>
            </div>

            <div class="mb-3" *ngIf="noOfSeat >= 2">
              <label class="form-label">Passenger 2</label>
              <input type="text" class="form-control"
                [(ngModel)]="passenger2" placeholder="Full Name">
            </div>

            <div class="mb-3" *ngIf="noOfSeat >= 3">
              <label class="form-label">Passenger 3</label>
              <input type="text" class="form-control"
                [(ngModel)]="passenger3" placeholder="Full Name">
            </div>

            <div class="mb-3" *ngIf="noOfSeat >= 4">
              <label class="form-label">Passenger 4</label>
              <input type="text" class="form-control"
                [(ngModel)]="passenger4" placeholder="Full Name">
            </div>

            <div class="alert alert-info">
              <strong>Total Price: ₹{{ totalPrice }}</strong>
              ({{ noOfSeat }} seat{{ noOfSeat > 1 ? 's' : '' }} × ₹{{ flight?.price }})
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-secondary"
                (click)="goBack()">Back</button>
              <button class="btn btn-primary flex-grow-1"
                (click)="proceedToConfirm()">
                Proceed to Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BookFlightComponent implements OnInit {
  flight: any = null;
  user: any = null;
  noOfSeat = 1;
  passenger2 = '';
  passenger3 = '';
  passenger4 = '';
  totalPrice = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flightService: FlightService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    const flightId = this.route.snapshot.paramMap.get('flightId');
    if (flightId) {
      this.flightService.getFlightById(+flightId).subscribe((res: any) => {
        this.flight = res.data;
        this.updateTotal();
      });
    }
  }

  updateTotal(): void {
    this.totalPrice = this.noOfSeat * (this.flight?.price || 0);
  }

  proceedToConfirm(): void {
    const bookingData = {
      flightId: this.flight.id,
      userId: this.user.id,
      noOfSeat: this.noOfSeat,
      passenger2: this.passenger2,
      passenger3: this.passenger3,
      passenger4: this.passenger4,
      flight: this.flight,
      totalPrice: this.totalPrice
    };
    // Store in sessionStorage and go to confirm page
    sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));
    this.router.navigate(['/confirm-booking']);
  }

  goBack(): void {
    this.router.navigate(['/flights']);
  }
}