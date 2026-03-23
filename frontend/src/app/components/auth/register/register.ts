import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card p-4 shadow">
            <h3 class="text-center mb-4 text-primary">
              ✈️ Create Account
            </h3>
            <div class="alert alert-danger" *ngIf="errorMsg">
              {{ errorMsg }}
            </div>
            <div class="alert alert-success" *ngIf="successMsg">
              {{ successMsg }}
            </div>
            <div class="mb-3">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control"
                [(ngModel)]="form.name" placeholder="Enter full name">
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control"
                [(ngModel)]="form.email" placeholder="Enter email">
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input type="password" class="form-control"
                [(ngModel)]="form.password" placeholder="Min 6 characters">
            </div>
            <div class="mb-3">
              <label class="form-label">Age</label>
              <input type="number" class="form-control"
                [(ngModel)]="form.age" placeholder="Enter age">
            </div>
            <div class="mb-3">
              <label class="form-label">Gender</label>
              <select class="form-select" [(ngModel)]="form.gender">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Country</label>
              <select class="form-select" [(ngModel)]="form.country">
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="Nepal">Nepal</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Sri Lanka">Sri Lanka</option>
                <option value="Pakistan">Pakistan</option>
              </select>
            </div>
            <button class="btn btn-primary w-100"
              (click)="register()" [disabled]="loading">
              {{ loading ? 'Registering...' : 'Register' }}
            </button>
            <div class="text-center mt-3">
              <span class="text-muted">Already registered? </span>
              <a routerLink="/login">Login Here</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  form = {
    name: '',
    email: '',
    password: '',
    age: 0,
    gender: '',
    country: ''
  };
  errorMsg = '';
  successMsg = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {
    if (!this.form.name || !this.form.email || !this.form.password) {
      this.errorMsg = 'Please fill all required fields';
      return;
    }
    this.loading = true;
    this.errorMsg = '';

    this.authService.register(this.form).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.successMsg = 'Registered successfully! Redirecting to login...';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.errorMsg = res.message;
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}