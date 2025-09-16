export interface User {
  id: number;
  username: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token?: string;
  id?: number;
  username?: string;
  role?: string;
  success: boolean;
}

export interface UserExistsResponse {
  exists: boolean;
  username?: string;
}

export interface PasswordSetResponse {
  passwordSet: boolean;
  username?: string;
}

export interface SetPasswordRequest {
  username: string;
  password: string;
}

export interface ForgotPasswordRequest {
  username: string;
  email?: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  failedAttempts: number;
  lastFailedAttempt: Date | null;
  isLocked: boolean;
}

export enum AuthActionType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  RESET_ATTEMPTS = 'RESET_ATTEMPTS',
  LOCK_ACCOUNT = 'LOCK_ACCOUNT'
}
