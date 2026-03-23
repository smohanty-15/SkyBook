import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../../services/flight.service';

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container py-4">
      <h3 class="page-title">✈️ Available Flights</h3>

      <!-- Filter -->
      <div class="card p-3 mb-4">
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
          <div class="col-md-3 d-flex gap-2">
            <button class="btn btn-primary flex-grow-1"
              (click)="searchFlights()">Search</button>
            <button class="btn btn-secondary"
              (click)="loadAll()">All</button>
          </div>
        </div>
        <div class="row mt-2 g-2">
          <div class="col-md-3">
            <select class="form-select" [(ngModel)]="sortBy"
              (change)="loadAll()">
              <option value="price">Sort by Price</option>
              <option value="departureDate">Sort by Date</option>
              <option value="availableSeats">Sort by Seats</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Flight No</th>
              <th>From → To</th>
              <th>Date</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Price</th>
              <th>Seats</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let f of flights">
              <td><strong>{{ f.flightNumber }}</strong></td>
              <td>{{ f.source }} → {{ f.destination }}</td>
              <td>{{ f.departureDate }}</td>
              <td>{{ f.departureTime | slice:11:16 }}</td>
              <td>{{ f.arrivalTime | slice:11:16 }}</td>
              <td><strong>₹{{ f.price }}</strong></td>
              <td>
                <span [class]="f.availableSeats > 5 ?
                  'text-success' : 'text-danger'">
                  {{ f.availableSeats }}
                </span>
              </td>
              <td>
                <a [routerLink]="['/book-flight', f.id]"
                  class="btn btn-sm btn-primary"
                  [class.disabled]="f.availableSeats <= 0">
                  {{ f.availableSeats > 0 ? 'Book' : 'Full' }}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="text-center py-4" *ngIf="flights.length === 0">
          <p class="text-muted">No flights available</p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="d-flex justify-content-between align-items-center mt-3">
        <button class="btn btn-outline-primary btn-sm"
          (click)="prevPage()" [disabled]="currentPage === 0">
          ← Previous
        </button>
        <span class="text-muted">Page {{ currentPage + 1 }}</span>
        <button class="btn btn-outline-primary btn-sm"
          (click)="nextPage()" [disabled]="isLastPage">
          Next →
        </button>
      </div>
    </div>
  `
})
export class FlightListComponent implements OnInit {
  flights: any[] = [];
  source = '';
  destination = '';
  travelDate = '';
  sortBy = 'price';
  currentPage = 0;
  pageSize = 10;
  isLastPage = false;

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.flightService.getFlightsPaged(
      this.currentPage, this.pageSize, this.sortBy)
      .subscribe((res: any) => {
        this.flights = res.data?.content || [];
        this.isLastPage = res.data?.last || false;
      });
  }

  searchFlights(): void {
    if (!this.source || !this.destination) {
      this.loadAll();
      return;
    }
    const obs = this.travelDate
      ? this.flightService.searchFlightsByDate(
          this.source, this.destination, this.travelDate)
      : this.flightService.searchFlights(this.source, this.destination);

    obs.subscribe((res: any) => {
      this.flights = res.data || [];
    });
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAll();
    }
  }

  nextPage(): void {
    this.currentPage++;
    this.loadAll();
  }
}