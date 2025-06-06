
// Authentication service layer
import { loginUser, signupUser, logoutUser, refreshToken } from '../api/auth';
import type { LoginRequest, SignupRequest, AuthResponse } from '../api/auth';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await loginUser(credentials);
      return response;
    } catch (error) {
      console.error('Login service error:', error);
      throw new Error(error instanceof Error ? error.message : 'Login failed. Please check your credentials.');
    }
  }

  static async signup(userData: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await signupUser(userData);
      return response;
    } catch (error) {
      console.error('Signup service error:', error);
      throw new Error(error instanceof Error ? error.message : 'Signup failed. Please try again.');
    }
  }

  static async logout(token: string): Promise<void> => {
    try {
      await logoutUser(token);
    } catch (error) {
      console.error('Logout service error:', error);
      // Don't throw error for logout - still clear local state
    }
  }

  static async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await refreshToken();
      return response;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new Error('Session expired. Please login again.');
    }
  }
}
