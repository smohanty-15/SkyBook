import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlightService } from '../../../services/flight.service';

@Component({
  selector: 'app-flight-management',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="page-title mb-0">✈️ Flight Management</h3>
        <a routerLink="/admin/flights/add"
          class="btn btn-success">+ Add Flight</a>
      </div>

      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Flight No</th>
              <th>From → To</th>
              <th>Date</th>
              <th>Departure</th>
              <th>Price</th>
              <th>Seats</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let f of flights">
              <td><strong>{{ f.flightNumber }}</strong></td>
              <td>{{ f.source }} → {{ f.destination }}</td>
              <td>{{ f.departureDate }}</td>
              <td>{{ f.departureTime | slice:11:16 }}</td>
              <td>₹{{ f.price }}</td>
              <td>{{ f.availableSeats }}</td>
              <td>
                <span [class]="f.flightStatus === 'SCHEDULED' ?
                  'badge-confirmed' : 'badge-cancelled'">
                  {{ f.flightStatus }}
                </span>
              </td>
              <td>
                <a [routerLink]="['/admin/flights/edit', f.id]"
                  class="btn btn-sm btn-outline-primary me-1">Edit</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class FlightManagementComponent implements OnInit {
  flights: any[] = [];

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.flightService.getAllFlightsAdmin().subscribe((res: any) => {
      this.flights = res.data || [];
    });
  }
}