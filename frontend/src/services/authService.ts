import api from './api';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/models';

/**
 * Service for authentication-related API calls
 */
class AuthService {
  private static instance: AuthService;
  private readonly BASE_URL = '/auth';

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Login user
   * @param loginRequest Login credentials
   * @returns Promise with auth response
   */
  public async login(loginRequest: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(`${this.BASE_URL}/login`, loginRequest);
    api.setAuthData(response.data);
    return response.data;
  }

  /**
   * Register new user
   * @param registerRequest Registration data
   * @returns Promise with success message
   */
  public async register(registerRequest: RegisterRequest): Promise<string> {
    const response = await api.post<string>(`${this.BASE_URL}/register`, registerRequest);
    return response.data;
  }

  /**
   * Logout user
   */
  public logout(): void {
    api.clearToken();
    localStorage.removeItem('user');
    // Redirect to home page
    window.location.href = '/';
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    return api.isAuthenticated();
  }

  /**
   * Check if user has admin role
   */
  public isAdmin(): boolean {
    return api.isAdmin();
  }

  /**
   * Get current user
   */
  public getCurrentUser(): any {
    return api.getCurrentUser();
  }
}

export default AuthService.getInstance();