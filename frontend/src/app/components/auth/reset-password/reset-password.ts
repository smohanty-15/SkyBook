import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card p-4 shadow">
            <h4 class="text-primary mb-4 text-center">🔐 Reset Password</h4>
            <div class="alert alert-success" *ngIf="successMsg">{{ successMsg }}</div>
            <div class="alert alert-danger" *ngIf="errorMsg">{{ errorMsg }}</div>
            <div class="mb-3">
              <label class="form-label">Reset Token</label>
              <input type="text" class="form-control"
                [(ngModel)]="token" placeholder="Paste token from email">
            </div>
            <div class="mb-3">
              <label class="form-label">New Password</label>
              <input type="password" class="form-control"
                [(ngModel)]="newPassword" placeholder="Min 6 characters">
            </div>
            <button class="btn btn-primary w-100"
              (click)="resetPassword()" [disabled]="loading">
              {{ loading ? 'Resetting...' : 'Reset Password' }}
            </button>
            <div class="text-center mt-3">
              <a routerLink="/login">Back to Login</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ResetPasswordComponent {
  token = '';
  newPassword = '';
  successMsg = '';
  errorMsg = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  resetPassword(): void {
    if (!this.token || !this.newPassword) return;
    this.loading = true;
    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (res: any) => {
        this.successMsg = 'Password reset! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Invalid or expired token';
        this.loading = false;
      }
    });
  }
}