import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card p-4 shadow border-warning">
            <h3 class="text-center mb-4 text-warning">
              🔐 Admin Login
            </h3>
            <div class="alert alert-danger" *ngIf="errorMsg">
              {{ errorMsg }}
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control"
                [(ngModel)]="email" placeholder="Admin email">
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input type="password" class="form-control"
                [(ngModel)]="password" placeholder="Admin password">
            </div>
            <button class="btn btn-warning w-100"
              (click)="login()" [disabled]="loading">
              {{ loading ? 'Logging in...' : 'Admin Login' }}
            </button>
            <div class="text-center mt-3">
              <a routerLink="/home" class="text-muted small">← Back to Home</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
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
      this.errorMsg = 'Please enter credentials';
      return;
    }
    this.loading = true;
    this.authService.adminLogin({ email: this.email, password: this.password })
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.router.navigate(['/admin/dashboard']);
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