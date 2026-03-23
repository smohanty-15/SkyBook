import { Routes } from '@angular/router';
import { authGuard } from './guards/auth';
import { adminGuard } from './guards/admin';

export const routes: Routes = [

  // ── Public Routes ────────────────────────────
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home/home')
      .then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login')
      .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register')
      .then(m => m.RegisterComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./components/auth/forgot-password/forgot-password')
      .then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./components/auth/reset-password/reset-password')
      .then(m => m.ResetPasswordComponent)
  },
  {
    path: 'pnr-check',
    loadComponent: () => import('./components/home/pnr-check/pnr-check')
      .then(m => m.PnrCheckComponent)
  },

  // ── User Routes (Auth Required) ───────────────
  {
    path: 'dashboard',
    loadComponent: () => import('./components/user/dashboard/dashboard')
      .then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/user/profile/profile')
      .then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'my-bookings',
    loadComponent: () => import('./components/user/booking-history/booking-history')
      .then(m => m.BookingHistoryComponent),
    canActivate: [authGuard]
  },
  {
    path: 'flights',
    loadComponent: () => import('./components/flights/flight-list/flight-list')
      .then(m => m.FlightListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'book-flight/:flightId',
    loadComponent: () => import('./components/flights/book-flight/book-flight')
      .then(m => m.BookFlightComponent),
    canActivate: [authGuard]
  },
  {
    path: 'confirm-booking',
    loadComponent: () => import('./components/flights/confirm-booking/confirm-booking')
      .then(m => m.ConfirmBookingComponent),
    canActivate: [authGuard]
  },

  // ── Admin Routes ──────────────────────────────
  {
    path: 'admin/login',
    loadComponent: () => import('./components/admin/admin-login/admin-login')
      .then(m => m.AdminLoginComponent)
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard')
      .then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/flights',
    loadComponent: () => import('./components/admin/flight-management/flight-management')
      .then(m => m.FlightManagementComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/flights/add',
    loadComponent: () => import('./components/admin/add-flight/add-flight')
      .then(m => m.AddFlightComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/flights/edit/:id',
    loadComponent: () => import('./components/admin/edit-flight/edit-flight')
      .then(m => m.EditFlightComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/bookings',
    loadComponent: () => import('./components/admin/all-bookings/all-bookings')
      .then(m => m.AllBookingsComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/users',
    loadComponent: () => import('./components/admin/all-users/all-users')
      .then(m => m.AllUsersComponent),
    canActivate: [adminGuard]
  },

  // ── Wildcard ──────────────────────────────────
  { path: '**', redirectTo: '/home' }
];