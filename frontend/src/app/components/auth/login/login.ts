import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card p-4 shadow">
            <h3 class="text-center mb-4 text-primary">
              ✈️ User Login
            </h3>
            <div class="alert alert-danger" *ngIf="errorMsg">
              {{ errorMsg }}
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control"
                [(ngModel)]="email" placeholder="Enter email">
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input type="password" class="form-control"
                [(ngModel)]="password" placeholder="Enter password">
            </div>
            <div class="text-end mb-3">
              <a routerLink="/forgot-password" class="text-muted small">
                Forgot Password?
              </a>
            </div>
            <button class="btn btn-primary w-100"
              (click)="login()" [disabled]="loading">
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>
            <div class="text-center mt-3">
              <span class="text-muted">New user? </span>
              <a routerLink="/register">Register Here</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    if (!this.email || !this.password) {
      this.errorMsg = 'Please enter email and password';
      return;
    }
    this.loading = true;
    this.errorMsg = '';

    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMsg = res.message;
          }
          this.loading = false;
        },
        error: (err) => {
          this.errorMsg = err.error?.message || 'Login failed';
          this.loading = false;
        }
      });
  }
}