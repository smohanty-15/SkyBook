import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private userRole = new BehaviorSubject<string>(this.getRole());

  isLoggedIn$ = this.loggedIn.asObservable();
  userRole$ = this.userRole.asObservable();

  constructor(private http: HttpClient) {}

  // ── User Auth ──────────────────────────────────
  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, request);
  }

  login(request: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, request).pipe(
      tap((res: any) => {
        if (res.success) {
          this.saveSession(res.data);
        }
      })
    );
  }

  // ── Admin Auth ─────────────────────────────────
  adminLogin(request: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/login`, request).pipe(
      tap((res: any) => {
        if (res.success) {
          this.saveSession(res.data);
        }
      })
    );
  }

  // ── Session Management ─────────────────────────
  private saveSession(data: AuthResponse): void {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('role', data.role);
    localStorage.setItem('user', JSON.stringify(data.user));
    this.loggedIn.next(true);
    this.userRole.next(data.role);
  }

  logout(): void {
    localStorage.clear();
    this.loggedIn.next(false);
    this.userRole.next('');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserId(): number | null {
    const user = this.getUser();
    return user ? user.id : null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isUser(): boolean {
    return this.getRole() === 'USER';
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // ── Forgot / Reset Password ────────────────────
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/reset-password`,
      { token, newPassword });
  }

  // ── Refresh Token ──────────────────────────────
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap((res: any) => {
        if (res.success) {
          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('refreshToken', res.data.refreshToken);
        }
      })
    );
  }
}