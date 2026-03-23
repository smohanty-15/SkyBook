import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { FlightService } from '../../../services/flight.service';
import { BookingService } from '../../../services/booking.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-4">
      <h3 class="page-title">⚙️ Admin Dashboard</h3>

      <!-- Stats -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card p-3 text-center border-primary">
            <h2 class="text-primary">{{ totalFlights }}</h2>
            <p class="mb-0">Total Flights</p>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card p-3 text-center border-success">
            <h2 class="text-success">{{ totalBookings }}</h2>
            <p class="mb-0">Total Bookings</p>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card p-3 text-center border-info">
            <h2 class="text-info">{{ totalUsers }}</h2>
            <p class="mb-0">Total Users</p>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card p-3 text-center border-warning">
            <h2 class="text-warning">₹{{ totalRevenue }}</h2>
            <p class="mb-0">Total Revenue</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row">
        <div class="col-md-3 mb-3">
          <div class="card p-3 text-center h-100">
            <div style="font-size: 2rem;">✈️</div>
            <h6 class="mt-2">Manage Flights</h6>
            <a routerLink="/admin/flights"
              class="btn btn-primary btn-sm mt-2">Go</a>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card p-3 text-center h-100">
            <div style="font-size: 2rem;">➕</div>
            <h6 class="mt-2">Add Flight</h6>
            <a routerLink="/admin/flights/add"
              class="btn btn-success btn-sm mt-2">Go</a>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card p-3 text-center h-100">
            <div style="font-size: 2rem;">📋</div>
            <h6 class="mt-2">All Bookings</h6>
            <a routerLink="/admin/bookings"
              class="btn btn-info btn-sm mt-2 text-white">Go</a>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card p-3 text-center h-100">
            <div style="font-size: 2rem;">👥</div>
            <h6 class="mt-2">All Users</h6>
            <a routerLink="/admin/users"
              class="btn btn-warning btn-sm mt-2">Go</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  totalFlights = 0;
  totalBookings = 0;
  totalUsers = 0;
  totalRevenue = 0;

  constructor(
    private flightService: FlightService,
    private bookingService: BookingService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.flightService.getAllFlightsAdmin().subscribe((res: any) => {
      this.totalFlights = res.data?.length || 0;
    });

    this.bookingService.getAllBookings().subscribe((res: any) => {
      this.totalBookings = res.data?.length || 0;
      this.totalRevenue = res.data?.reduce((sum: number, b: any) =>
        sum + (b.flight?.price * b.noOfSeat || 0), 0) || 0;
    });

    this.userService.getAllUsers().subscribe((res: any) => {
      this.totalUsers = res.data?.length || 0;
    });
  }
}