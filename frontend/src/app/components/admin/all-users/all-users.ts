import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-4">
      <h3 class="page-title">👥 All Users</h3>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of users">
              <td>{{ u.id }}</td>
              <td>{{ u.name }}</td>
              <td>{{ u.email }}</td>
              <td>{{ u.age }}</td>
              <td>{{ u.gender }}</td>
              <td>{{ u.country }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AllUsersComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((res: any) => {
      this.users = res.data || [];
    });
  }
}