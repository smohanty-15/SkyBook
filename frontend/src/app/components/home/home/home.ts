import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../../services/flight.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <div class="hero-section bg-primary text-white py-5">
      <div class="container text-center py-4">
        <h1 class="display-4 fw-bold">✈️ Welcome to SkyBook</h1>
        <p class="lead mb-4">Search and book flights easily</p>

        <!-- Search Box -->
        <div class="card mx-auto shadow-lg" style="max-width: 650px; border-radius: 16px;">
          <div class="card-body p-4">
            <h5 class="text-dark mb-3">Search Flights</h5>
            <div class="row g-2">
              <div class="col-md-4">
                <input type="text" class="form-control"
                  placeholder="From (Source)"
                  [(ngModel)]="source">
              </div>
              <div class="col-md-4">
                <input type="text" class="form-control"
                  placeholder="To (Destination)"
                  [(ngModel)]="destination">
              </div>
              <div class="col-md-4">
                <input type="date" class="form-control"
                  [(ngModel)]="travelDate">
              </div>
            </div>
            <button class="btn btn-primary mt-3 px-5"
              (click)="searchFlights()">
              🔍 Search Flights
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Results -->
    <div class="container mt-5" *ngIf="searchResults.length > 0">
      <h3 class="page-title">Available Flights</h3>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Flight No</th>
              <th>From</th>
              <th>To</th>
              <th>Date</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Price</th>
              <th>Seats</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let flight of searchResults">
              <td><strong>{{ flight.flightNumber }}</strong></td>
              <td>{{ flight.source }}</td>
              <td>{{ flight.destination }}</td>
              <td>{{ flight.departureDate }}</td>
              <td>{{ flight.departureTime | slice:11:16 }}</td>
              <td>{{ flight.arrivalTime | slice:11:16 }}</td>
              <td>₹{{ flight.price }}</td>
              <td>{{ flight.availableSeats }}</td>
              <td>
                <button class="btn btn-sm btn-primary"
                  (click)="bookFlight(flight)"
                  [disabled]="flight.availableSeats <= 0">
                  {{ flight.availableSeats > 0 ? 'Book Now' : 'Full' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- No Results -->
    <div class="container mt-4 text-center"
      *ngIf="searched && searchResults.length === 0">
      <div class="alert alert-info">
        No flights found for this route. Try different dates or cities.
      </div>
    </div>

    <!-- Features Section -->
    <div class="container mt-5 mb-5">
      <div class="row text-center">
        <div class="col-md-4 mb-4">
          <div class="card p-4 h-100">
            <div style="font-size: 3rem;">🔍</div>
            <h5 class="mt-3">Easy Search</h5>
            <p class="text-muted">Search flights by source, destination and date</p>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card p-4 h-100">
            <div style="font-size: 3rem;">🎟️</div>
            <h5 class="mt-3">Quick Booking</h5>
            <p class="text-muted">Book tickets in just a few clicks</p>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card p-4 h-100">
            <div style="font-size: 3rem;">📄</div>
            <h5 class="mt-3">PDF Tickets</h5>
            <p class="text-muted">Download your boarding pass as PDF</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
    }
  `]
})
export class HomeComponent {
  source = '';
  destination = '';
  travelDate = '';
  searchResults: any[] = [];
  searched = false;

  constructor(
    private flightService: FlightService,
    private authService: AuthService,
    private router: Router
  ) {}

  searchFlights(): void {
    if (!this.source || !this.destination) {
      alert('Please enter source and destination');
      return;
    }
    if (this.travelDate) {
      this.flightService.searchFlightsByDate(
        this.source, this.destination, this.travelDate)
        .subscribe((res: any) => {
          this.searchResults = res.data || [];
          this.searched = true;
        });
    } else {
      this.flightService.searchFlights(this.source, this.destination)
        .subscribe((res: any) => {
          this.searchResults = res.data || [];
          this.searched = true;
        });
    }
  }

  bookFlight(flight: any): void {
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/book-flight', flight.id]);
  }
}