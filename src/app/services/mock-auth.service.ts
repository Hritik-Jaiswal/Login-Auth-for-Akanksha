import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  UserExistsResponse,
  PasswordSetResponse,
  LoginResponse,
  SetPasswordRequest,
  ForgotPasswordRequest
} from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  // Mock user database
  private mockUsers = [
    { username: 'admin', password: 'admin123', role: 'ROLE_ADMIN', hasPassword: true },
    { username: 'akanksha', password: 'akanksha123', role: 'USER', hasPassword: true },
    { username: 'izel', password: 'izel123', role: 'USER', hasPassword: true },
    { username: 'vaidhei', password: 'vaidhei123', role: 'USER', hasPassword: true },
    { username: 'user', password: null, role: 'USER', hasPassword: false }
  ];

  checkUserExists(username: string): Observable<UserExistsResponse> {
    const user = this.mockUsers.find(u => u.username === username);
    return of({ exists: !!user, username }).pipe(delay(500));
  }

  isPasswordSet(username: string): Observable<PasswordSetResponse> {
    const user = this.mockUsers.find(u => u.username === username);
    return of({ 
      passwordSet: user ? user.hasPassword : false, 
      username 
    }).pipe(delay(300));
  }

  setPassword(username: string, password: string): Observable<any> {
    const user = this.mockUsers.find(u => u.username === username);
    if (user) {
      user.password = password;
      user.hasPassword = true;
      return of({ message: 'Password set successfully' }).pipe(delay(500));
    }
    return throwError(() => new Error('User not found'));
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const user = this.mockUsers.find(u => u.username === username);
    
    if (!user) {
      return throwError(() => new Error('User not found')).pipe(delay(500));
    }

    if (user.password !== password) {
      return throwError(() => new Error('Invalid password')).pipe(delay(500));
    }

    return of({
      message: 'Login successful',
      token: 'mock-jwt-token-' + Date.now(),
      id: Math.floor(Math.random() * 1000),
      username: user.username,
      role: user.role,
      success: true
    }).pipe(delay(800));
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<any> {
    const user = this.mockUsers.find(u => u.username === request.username);
    if (user) {
      return of({ 
        message: 'Password reset instructions sent to your email' 
      }).pipe(delay(1000));
    }
    return throwError(() => new Error('User not found'));
  }
}
