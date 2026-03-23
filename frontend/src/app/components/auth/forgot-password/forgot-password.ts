import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card p-4 shadow">
            <h4 class="text-primary mb-4 text-center">🔑 Forgot Password</h4>
            <div class="alert alert-success" *ngIf="successMsg">{{ successMsg }}</div>
            <div class="alert alert-danger" *ngIf="errorMsg">{{ errorMsg }}</div>
            <div class="mb-3">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-control"
                [(ngModel)]="email" placeholder="Enter your email">
            </div>
            <button class="btn btn-primary w-100"
              (click)="sendResetEmail()" [disabled]="loading">
              {{ loading ? 'Sending...' : 'Send Reset Email' }}
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
export class ForgotPasswordComponent {
  email = '';
  successMsg = '';
  errorMsg = '';
  loading = false;

  constructor(private authService: AuthService) {}

  sendResetEmail(): void {
    if (!this.email) return;
    this.loading = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: (res: any) => {
        this.successMsg = 'Reset email sent! Check your inbox.';
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Email not found';
        this.loading = false;
      }
    });
  }
}