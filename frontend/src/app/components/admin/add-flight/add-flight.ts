import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../../services/flight.service';

@Component({
  selector: 'app-add-flight',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card p-4 shadow">
            <h4 class="text-primary mb-4">➕ Add New Flight</h4>
            <div class="alert alert-success" *ngIf="successMsg">{{ successMsg }}</div>
            <div class="alert alert-danger" *ngIf="errorMsg">{{ errorMsg }}</div>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Flight Number</label>
                <input type="text" class="form-control"
                  [(ngModel)]="flight.flightNumber" placeholder="e.g. SK101">
              </div>
              <div class="col-md-6">
                <label class="form-label">Departure Date</label>
                <input type="date" class="form-control"
                  [(ngModel)]="flight.departureDate">
              </div>
              <div class="col-md-6">
                <label class="form-label">Source</label>
                <input type="text" class="form-control"
                  [(ngModel)]="flight.source" placeholder="e.g. Mumbai">
              </div>
              <div class="col-md-6">
                <label class="form-label">Destination</label>
                <input type="text" class="form-control"
                  [(ngModel)]="flight.destination" placeholder="e.g. Delhi">
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
                  [(ngModel)]="flight.price" placeholder="e.g. 4500">
              </div>
              <div class="col-md-6">
                <label class="form-label">Available Seats</label>
                <input type="number" class="form-control"
                  [(ngModel)]="flight.availableSeats" placeholder="e.g. 60">
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
              <button class="btn btn-success flex-grow-1"
                (click)="addFlight()" [disabled]="loading">
                {{ loading ? 'Adding...' : '+ Add Flight' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AddFlightComponent {
  flight: any = {
    flightNumber: '',
    departureDate: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    price: null,
    availableSeats: null,
    flightStatus: 'SCHEDULED'
  };
  successMsg = '';
  errorMsg = '';
  loading = false;

  constructor(
    private flightService: FlightService,
    private router: Router
  ) {}

  addFlight(): void {
    this.loading = true;
    this.flightService.addFlight(this.flight).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.successMsg = 'Flight added successfully!';
          setTimeout(() => this.router.navigate(['/admin/flights']), 1500);
        } else {
          this.errorMsg = res.message;
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Failed to add flight';
        this.loading = false;
      }
    });
  }
}