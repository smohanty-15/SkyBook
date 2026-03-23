import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card p-4 shadow">
            <h4 class="text-primary mb-4">👤 My Profile</h4>

            <div class="alert alert-success" *ngIf="successMsg">{{ successMsg }}</div>
            <div class="alert alert-danger" *ngIf="errorMsg">{{ errorMsg }}</div>

            <div class="mb-3">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control"
                [(ngModel)]="form.name">
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control"
                [value]="user?.email" readonly>
            </div>
            <div class="mb-3">
              <label class="form-label">Age</label>
              <input type="number" class="form-control"
                [(ngModel)]="form.age">
            </div>
            <div class="mb-3">
              <label class="form-label">Gender</label>
              <select class="form-select" [(ngModel)]="form.gender">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Country</label>
              <input type="text" class="form-control"
                [(ngModel)]="form.country">
            </div>
            <button class="btn btn-primary w-100"
              (click)="updateProfile()">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user: any = null;
  form = { name: '', age: 0, gender: '', country: '' };
  successMsg = '';
  errorMsg = '';

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (this.user) {
      this.form.name = this.user.name;
      this.form.age = this.user.age;
      this.form.gender = this.user.gender;
      this.form.country = this.user.country;
    }
  }

  updateProfile(): void {
    this.userService.updateProfile(this.user.id, this.form).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.successMsg = 'Profile updated successfully!';
          const updated = { ...this.user, ...this.form };
          localStorage.setItem('user', JSON.stringify(updated));
        }
      },
      error: () => { this.errorMsg = 'Update failed'; }
    });
  }
}