import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { FlightService } from '../../../services/flight.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container py-4">
      <div class="card p-4 mb-4" style="background: linear-gradient(135deg, #0d6efd, #0a58ca); color: white; border-radius: 16px;">
        <h2>Welcome back, {{ user?.name }}! ✈️</h2>
        <p class="mb-0">Ready to book your next flight?</p>
      </div>

      <!-- Quick Links -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card p-3 text-center h-100">
            <div style="font-size: 2.5rem;">✈️</div>
            <h6 class="mt-2">View Flights</h6>
            <a routerLink="/flights" class="btn btn-primary btn-sm mt-2">Go</a>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card p-3 text-center h-100">
            <div style="font-size: 2.5rem;">📋</div>
            <h6 class="mt-2">My Bookings</h6>
            <a routerLink="/my-bookings" class="btn btn-primary btn-sm mt-2">Go</a>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card p-3 text-center h-100">
            <div style="font-size: 2.5rem;">👤</div>
            <h6 class="mt-2">My Profile</h6>
            <a routerLink="/profile" class="btn btn-primary btn-sm mt-2">Go</a>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card p-3 text-center h-100">
            <div style="font-size: 2.5rem;">🔍</div>
            <h6 class="mt-2">Check PNR</h6>
            <a routerLink="/pnr-check" class="btn btn-primary btn-sm mt-2">Go</a>
          </div>
        </div>
      </div>

      <!-- Search Flights -->
      <div class="card p-4">
        <h5 class="text-primary mb-3">🔍 Search Flights</h5>
        <div class="row g-2">
          <div class="col-md-3">
            <input type="text" class="form-control"
              placeholder="From" [(ngModel)]="source">
          </div>
          <div class="col-md-3">
            <input type="text" class="form-control"
              placeholder="To" [(ngModel)]="destination">
          </div>
          <div class="col-md-3">
            <input type="date" class="form-control"
              [(ngModel)]="travelDate">
          </div>
          <div class="col-md-3">
            <button class="btn btn-primary w-100"
              (click)="searchFlights()">Search</button>
          </div>
        </div>
      </div>

      <!-- Search Results -->
      <div class="mt-4" *ngIf="searchResults.length > 0">
        <h5 class="text-primary">Available Flights</h5>
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Flight</th>
                <th>From → To</th>
                <th>Date</th>
                <th>Time</th>
                <th>Price</th>
                <th>Seats</th>
                <th>Book</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let f of searchResults">
                <td>{{ f.flightNumber }}</td>
                <td>{{ f.source }} → {{ f.destination }}</td>
                <td>{{ f.departureDate }}</td>
                <td>{{ f.departureTime | slice:11:16 }}</td>
                <td>₹{{ f.price }}</td>
                <td>{{ f.availableSeats }}</td>
                <td>
                  <button class="btn btn-sm btn-primary"
                    [routerLink]="['/book-flight', f.id]"
                    [disabled]="f.availableSeats <= 0">
                    Book
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  user: any = null;
  source = '';
  destination = '';
  travelDate = '';
  searchResults: any[] = [];

  constructor(
    private authService: AuthService,
    private flightService: FlightService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  searchFlights(): void {
    if (!this.source || !this.destination) return;
    const obs = this.travelDate
      ? this.flightService.searchFlightsByDate(
          this.source, this.destination, this.travelDate)
      : this.flightService.searchFlights(this.source, this.destination);

    obs.subscribe((res: any) => {
      this.searchResults = res.data || [];
    });
  }
}