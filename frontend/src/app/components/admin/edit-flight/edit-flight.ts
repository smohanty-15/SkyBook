import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../../services/flight.service';

@Component({
  selector: 'app-edit-flight',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card p-4 shadow">
            <h4 class="text-primary mb-4">✏️ Edit Flight</h4>
            <div class="alert alert-success" *ngIf="successMsg">{{ successMsg }}</div>
            <div class="alert alert-danger" *ngIf="errorMsg">{{ errorMsg }}</div>

            <div class="row g-3" *ngIf="flight">
              <div class="col-md-6">
                <label class="form-label">Flight Number</label>
                <input type="text" class="form-control"
                  [(ngModel)]="flight.flightNumber">
              </div>
              <div class="col-md-6">
                <label class="form-label">Departure Date</label>
                <input type="date" class="form-control"
                  [(ngModel)]="flight.departureDate">
              </div>
              <div class="col-md-6">
                <label class="form-label">Source</label>
                <input type="text" class="form-control"
                  [(ngModel)]="flight.source">
              </div>
              <div class="col-md-6">
                <label class="form-label">Destination</label>
                <input type="text" class="form-control"
                  [(ngModel)]="flight.destination">
              </div>
              <div class="col-md-6">
                <label class="form-label">Departure Time</label>
                <input type="datetime-local" class="form-control"
                  [(ngModel)]="flight.departureTime">
              </div>
              <div class="col-md-6">
                <label class="form-label">Arrival Time</label>
                <input type="datetime-local" class="form-control"
                  [(ngModel)]="flight.arrivalTime">
              </div>
              <div class="col-md-6">
                <label class="form-label">Price (₹)</label>
                <input type="number" class="form-control"
                  [(ngModel)]="flight.price">
              </div>
              <div class="col-md-6">
                <label class="form-label">Available Seats</label>
                <input type="number" class="form-control"
                  [(ngModel)]="flight.availableSeats">
              </div>
              <div class="col-md-6">
                <label class="form-label">Status</label>
                <select class="form-select" [(ngModel)]="flight.flightStatus">
                  <option value="SCHEDULED">SCHEDULED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="DELAYED">DELAYED</option>
                </select>
              </div>
            </div>

            <div class="d-flex gap-2 mt-4">
              <a routerLink="/admin/flights"
                class="btn btn-secondary">Cancel</a>
              <button class="btn btn-primary flex-grow-1"
                (click)="updateFlight()" [disabled]="loading">
                {{ loading ? 'Updating...' : 'Update Flight' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EditFlightComponent implements OnInit {
  flight: any = null;
  successMsg = '';
  errorMsg = '';
  loading = false;
  flightId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flightService: FlightService
  ) {}

  ngOnInit(): void {
    this.flightId = +this.route.snapshot.paramMap.get('id')!;
    this.flightService.getFlightById(this.flightId).subscribe((res: any) => {
      this.flight = res.data;
    });
  }

  updateFlight(): void {
    this.loading = true;
    this.flightService.editFlight(this.flightId, this.flight).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.successMsg = 'Flight updated!';
          setTimeout(() => this.router.navigate(['/admin/flights']), 1500);
        } else {
          this.errorMsg = res.message;
        }
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Update failed';
        this.loading = false;
      }
    });
  }
}