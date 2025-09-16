import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, interval } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AuthState } from '../../models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  loginForm!: FormGroup;
  message = '';
  messageType: 'success' | 'error' | 'warning' | 'info' = 'info';
  usernameChecked = false;
  passwordAlreadySet = false;
  loading = false;
  showForgotPassword = false;
  authState: AuthState | null = null;
  lockoutTimeRemaining = 0;

  ngOnInit() {
    this.initializeForm();
    this.subscribeToAuthState();
    this.startLockoutTimer();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  private subscribeToAuthState(): void {
    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.authState = state;
        this.updateLockoutStatus();
      });
  }

  private startLockoutTimer(): void {
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.authState?.isLocked) {
          this.lockoutTimeRemaining = this.authService.getRemainingLockoutTime();
          if (this.lockoutTimeRemaining <= 0) {
            this.authService.resetFailedAttempts();
          }
        }
      });
  }

  private updateLockoutStatus(): void {
    if (this.authState?.isLocked) {
      this.lockoutTimeRemaining = this.authService.getRemainingLockoutTime();
      const minutes = Math.ceil(this.lockoutTimeRemaining / 60000);
      this.message = `Account locked due to multiple failed attempts. Try again in ${minutes} minute(s).`;
      this.messageType = 'error';
    }
  }

  checkUser(): void {
    const username = this.loginForm.get('username')?.value?.trim();

    if (!username) {
      this.setMessage('Please enter a username to check', 'warning');
      return;
    }

    if (this.loginForm.get('username')?.invalid) {
      this.setMessage('Username must be at least 3 characters long', 'warning');
      return;
    }

    this.loading = true;
    this.authService.checkUserExists(username).subscribe({
      next: (res) => {
        if (!res.exists) {
          this.setMessage('Invalid username - please register first', 'error');
          this.resetUserCheck();
        } else {
          this.usernameChecked = true;
          this.checkPasswordStatus(username);
        }
      },
      error: (error) => {
        this.setMessage(`Error checking username: ${error.message}`, 'error');
        this.loading = false;
      }
    });
  }

  private checkPasswordStatus(username: string): void {
    this.authService.isPasswordSet(username).subscribe({
      next: (resp) => {
        this.passwordAlreadySet = resp.passwordSet;
        this.setMessage(
          this.passwordAlreadySet
            ? 'Password exists - please enter your password'
            : 'No password set - please create a password now',
          'info'
        );
        this.loginForm.get('password')?.reset();
        this.loading = false;
      },
      error: (error) => {
        this.setMessage(`Error checking password status: ${error.message}`, 'error');
        this.loading = false;
      }
    });
  }

  private resetUserCheck(): void {
    this.usernameChecked = false;
    this.passwordAlreadySet = false;
    this.loginForm.get('password')?.reset();
    this.loading = false;
  }

  submit(): void {
    if (this.authState?.isLocked) {
      this.updateLockoutStatus();
      return;
    }

    if (this.loginForm.invalid) {
      this.setMessage('Please enter all required fields correctly', 'warning');
      this.markFormGroupTouched();
      return;
    }

    if (!this.usernameChecked) {
      this.setMessage('Please check username first', 'warning');
      return;
    }

    this.loading = true;
    const { username, password } = this.loginForm.value;

    if (!this.passwordAlreadySet) {
      this.setPassword(username, password);
    } else {
      this.attemptLogin(username, password);
    }
  }

  private setPassword(username: string, password: string): void {
    this.authService.setPassword(username, password).subscribe({
      next: () => {
        this.setMessage('Password created successfully. Please log in now.', 'success');
        this.passwordAlreadySet = true;
        this.loginForm.get('password')?.reset();
        this.loading = false;
      },
      error: (error) => {
        this.setMessage(`Password creation failed: ${error.message}`, 'error');
        this.loading = false;
      }
    });
  }

  private attemptLogin(username: string, password: string): void {
    this.authService.login(username, password).subscribe({
      next: (response) => {
        if (response.success && response.message === 'Login successful') {
          this.setMessage('Login successful', 'success');
          this.navigateBasedOnRole(response.role!);
        } else {
          this.setMessage(response.message || 'Login failed', 'error');
        }
        this.loading = false;
      },
      error: (error) => {
        this.handleLoginError(error, username);
        this.loading = false;
      }
    });
  }

  private handleLoginError(error: any, username: string): void {
    const failedAttempts = this.authState?.failedAttempts || 0;
    const maxAttempts = 3;
    const remainingAttempts = maxAttempts - failedAttempts - 1;

    if (remainingAttempts > 0) {
      this.setMessage(
        `Invalid password. ${remainingAttempts} attempt(s) remaining before account lockout.`,
        'error'
      );
    } else if (remainingAttempts === 0) {
      this.setMessage(
        'Invalid password. This is your last attempt before account lockout.',
        'error'
      );
    } else {
      this.setMessage(
        'Account locked due to multiple failed attempts. Consider resetting your password.',
        'error'
      );
      this.showPasswordChangeOption(username);
    }
  }

  private showPasswordChangeOption(username: string): void {
    this.showForgotPassword = true;
    // Pre-fill username for forgot password
    if (this.authState?.failedAttempts && this.authState.failedAttempts >= 3) {
      this.setMessage(
        'Multiple failed attempts detected. You can reset your password using the "Forgot Password" option below.',
        'warning'
      );
    }
  }

  private navigateBasedOnRole(role: string): void {
    setTimeout(() => {
      if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
        this.router.navigate(['/user']);
      } else {
        this.router.navigate(['/book']);
      }
    }, 1000);
  }

  forgotPassword(): void {
    const username = this.loginForm.get('username')?.value?.trim() || this.authService.getFailedUsername();
    
    if (!username) {
      this.setMessage('Please enter your username first', 'warning');
      return;
    }

    this.loading = true;
    this.authService.forgotPassword({ username }).subscribe({
      next: () => {
        this.setMessage(
          'Password reset instructions have been sent to your registered email.',
          'success'
        );
        this.loading = false;
      },
      error: (error) => {
        this.setMessage(`Failed to send reset instructions: ${error.message}`, 'error');
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.loginForm.reset();
    this.usernameChecked = false;
    this.passwordAlreadySet = false;
    this.showForgotPassword = false;
    this.message = '';
    this.messageType = 'info';
  }

  private setMessage(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    this.message = message;
    this.messageType = type;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  get usernameError(): string | null {
    const control = this.loginForm.get('username');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Username is required';
      if (control.errors['minlength']) return 'Username must be at least 3 characters';
    }
    return null;
  }

  get passwordError(): string | null {
    const control = this.loginForm.get('password');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Password is required';
      if (control.errors['minlength']) return 'Password must be at least 6 characters';
    }
    return null;
  }

  get lockoutTimeFormatted(): string {
    const minutes = Math.floor(this.lockoutTimeRemaining / 60000);
    const seconds = Math.floor((this.lockoutTimeRemaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
