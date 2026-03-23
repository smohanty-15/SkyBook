import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  updateProfile(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}/profile`, data);
  }

  // Admin
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users`);
  }
}