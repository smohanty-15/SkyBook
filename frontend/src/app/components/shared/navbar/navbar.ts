import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/home">
          ✈️ SkyBook
        </a>
        <button class="navbar-toggler" type="button"
          data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/home">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/pnr-check">Check PNR</a>
            </li>
            <ng-container *ngIf="isLoggedIn && isUser">
              <li class="nav-item">
                <a class="nav-link" routerLink="/flights">Flights</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/my-bookings">My Bookings</a>
              </li>
            </ng-container>
            <ng-container *ngIf="isLoggedIn && isAdmin">
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/dashboard">Dashboard</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/flights">Flights</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/bookings">Bookings</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/users">Users</a>
              </li>
            </ng-container>
          </ul>
          <ul class="navbar-nav">
            <ng-container *ngIf="!isLoggedIn">
              <li class="nav-item">
                <a class="nav-link btn btn-outline-light btn-sm mx-1 px-3"
                  routerLink="/login">Login</a>
              </li>
              <li class="nav-item">
                <a class="nav-link btn btn-light btn-sm mx-1 px-3 text-primary"
                  routerLink="/register">Register</a>
              </li>
              <li class="nav-item">
                <a class="nav-link btn btn-warning btn-sm mx-1 px-3"
                  routerLink="/admin/login">Admin</a>
              </li>
            </ng-container>
            <ng-container *ngIf="isLoggedIn">
              <li class="nav-item">
                <span class="nav-link text-light">
                  👤 {{ userName }}
                </span>
              </li>
              <ng-container *ngIf="isUser">
                <li class="nav-item">
                  <a class="nav-link" routerLink="/profile">Profile</a>
                </li>
              </ng-container>
              <li class="nav-item">
                <button class="btn btn-outline-light btn-sm mx-1"
                  (click)="logout()">Logout</button>
              </li>
            </ng-container>
          </ul>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  isUser = false;
  userName = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      if (status) {
        this.isAdmin = this.authService.isAdmin();
        this.isUser = this.authService.isUser();
        const user = this.authService.getUser();
        this.userName = user?.name || '';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}