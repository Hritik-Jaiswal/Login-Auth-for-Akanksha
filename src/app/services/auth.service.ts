import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  User,
  LoginRequest,
  LoginResponse,
  UserExistsResponse,
  PasswordSetResponse,
  SetPasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthState
} from '../models/auth.models';
import { MockAuthService } from './mock-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE_URL = 'http://localhost:8080/api'; // Adjust as needed
  private readonly MAX_FAILED_ATTEMPTS = 3;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    failedAttempts: 0,
    lastFailedAttempt: null,
    isLocked: false
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient, private mockAuth: MockAuthService) {
    this.loadAuthState();
  }

  private loadAuthState(): void {
    const token = sessionStorage.getItem('authToken');
    const userStr = sessionStorage.getItem('currentUser');
    const failedAttemptsStr = localStorage.getItem('failedAttempts');
    const lastFailedAttemptStr = localStorage.getItem('lastFailedAttempt');

    if (token && userStr) {
      const user: User = JSON.parse(userStr);
      this.authStateSubject.next({
        ...this.authStateSubject.value,
        isAuthenticated: true,
        user,
        token
      });
    }

    if (failedAttemptsStr) {
      const failedAttempts = parseInt(failedAttemptsStr, 10);
      const lastFailedAttempt = lastFailedAttemptStr ? new Date(lastFailedAttemptStr) : null;
      const isLocked = this.isAccountLocked(failedAttempts, lastFailedAttempt);

      this.authStateSubject.next({
        ...this.authStateSubject.value,
        failedAttempts,
        lastFailedAttempt,
        isLocked
      });
    }
  }

  private isAccountLocked(attempts: number, lastAttempt: Date | null): boolean {
    if (attempts < this.MAX_FAILED_ATTEMPTS || !lastAttempt) {
      return false;
    }

    const now = new Date().getTime();
    const lockoutEnd = lastAttempt.getTime() + this.LOCKOUT_DURATION;
    return now < lockoutEnd;
  }

  checkUserExists(username: string): Observable<UserExistsResponse> {
    // Use mock service for testing - replace with real API call when backend is ready
    return this.mockAuth.checkUserExists(username);
    // return this.http.get<UserExistsResponse>(`${this.API_BASE_URL}/auth/check-user/${username}`)
    //   .pipe(catchError(this.handleError));
  }

  isPasswordSet(username: string): Observable<PasswordSetResponse> {
    // Use mock service for testing - replace with real API call when backend is ready
    return this.mockAuth.isPasswordSet(username);
    // return this.http.get<PasswordSetResponse>(`${this.API_BASE_URL}/auth/password-status/${username}`)
    //   .pipe(catchError(this.handleError));
  }

  setPassword(username: string, password: string): Observable<any> {
    // Use mock service for testing - replace with real API call when backend is ready
    return this.mockAuth.setPassword(username, password);
    // const request: SetPasswordRequest = { username, password };
    // return this.http.post(`${this.API_BASE_URL}/auth/set-password`, request)
    //   .pipe(catchError(this.handleError));
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const currentState = this.authStateSubject.value;
    
    if (currentState.isLocked) {
      return throwError(() => new Error('Account is temporarily locked due to multiple failed attempts'));
    }

    const request: LoginRequest = { username, password };
    
    // Use mock service for testing - replace with real API call when backend is ready
    return this.mockAuth.login(username, password)
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            this.handleLoginSuccess(response);
          }
        }),
        catchError(error => {
          this.handleLoginFailure(username);
          return throwError(() => error);
        })
      );
    
    // Real API call (commented out for testing):
    // return this.http.post<LoginResponse>(`${this.API_BASE_URL}/auth/login`, request)
    //   .pipe(
    //     map(response => ({ ...response, success: true })),
    //     tap(response => {
    //       if (response.success && response.token) {
    //         this.handleLoginSuccess(response);
    //       }
    //     }),
    //     catchError(error => {
    //       this.handleLoginFailure(username);
    //       return throwError(() => error);
    //     })
    //   );
  }

  private handleLoginSuccess(response: LoginResponse): void {
    const user: User = {
      id: response.id!,
      username: response.username!,
      role: response.role!
    };

    sessionStorage.setItem('authToken', response.token!);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    
    // Reset failed attempts
    localStorage.removeItem('failedAttempts');
    localStorage.removeItem('lastFailedAttempt');

    this.authStateSubject.next({
      isAuthenticated: true,
      user,
      token: response.token!,
      failedAttempts: 0,
      lastFailedAttempt: null,
      isLocked: false
    });
  }

  private handleLoginFailure(username: string): void {
    const currentState = this.authStateSubject.value;
    const newFailedAttempts = currentState.failedAttempts + 1;
    const now = new Date();

    localStorage.setItem('failedAttempts', newFailedAttempts.toString());
    localStorage.setItem('lastFailedAttempt', now.toISOString());
    localStorage.setItem('failedUsername', username);

    const isLocked = newFailedAttempts >= this.MAX_FAILED_ATTEMPTS;

    this.authStateSubject.next({
      ...currentState,
      failedAttempts: newFailedAttempts,
      lastFailedAttempt: now,
      isLocked
    });
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<any> {
    // Use mock service for testing - replace with real API call when backend is ready
    return this.mockAuth.forgotPassword(request);
    // return this.http.post(`${this.API_BASE_URL}/auth/forgot-password`, request)
    //   .pipe(catchError(this.handleError));
  }

  resetPassword(request: ResetPasswordRequest): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/auth/reset-password`, request)
      .pipe(catchError(this.handleError));
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('currentUser');
    
    this.authStateSubject.next({
      isAuthenticated: false,
      user: null,
      token: null,
      failedAttempts: this.authStateSubject.value.failedAttempts,
      lastFailedAttempt: this.authStateSubject.value.lastFailedAttempt,
      isLocked: this.authStateSubject.value.isLocked
    });
  }

  resetFailedAttempts(): void {
    localStorage.removeItem('failedAttempts');
    localStorage.removeItem('lastFailedAttempt');
    localStorage.removeItem('failedUsername');

    this.authStateSubject.next({
      ...this.authStateSubject.value,
      failedAttempts: 0,
      lastFailedAttempt: null,
      isLocked: false
    });
  }

  getRemainingLockoutTime(): number {
    const currentState = this.authStateSubject.value;
    if (!currentState.isLocked || !currentState.lastFailedAttempt) {
      return 0;
    }

    const now = new Date().getTime();
    const lockoutEnd = currentState.lastFailedAttempt.getTime() + this.LOCKOUT_DURATION;
    return Math.max(0, lockoutEnd - now);
  }

  getFailedUsername(): string | null {
    return localStorage.getItem('failedUsername');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || `Server error: ${error.status}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
