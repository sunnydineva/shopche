import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AuthResponse } from '../types/models';

/**
 * Base API service for making HTTP requests
 */
class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

  private constructor() {
    this.api = axios.create({
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401 Unauthorized errors
        if (error.response && error.response.status === 401) {
          // Clear token and redirect to login
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  /**
   * Get JWT token from localStorage
   */
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Set JWT token in localStorage
   */
  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * Clear JWT token from localStorage
   */
  public clearToken(): void {
    localStorage.removeItem('token');
  }

  /**
   * Set auth data from login/register response
   */
  public setAuthData(authResponse: AuthResponse): void {
    this.setToken(authResponse.token);
    localStorage.setItem('user', JSON.stringify({
      id: authResponse.id,
      email: authResponse.email,
      roles: authResponse.roles,
    }));
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Check if user has admin role
   */
  public isAdmin(): boolean {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    
    try {
      const user = JSON.parse(userStr);
      return user.roles && user.roles.includes('ROLE_ADMIN');
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current user from localStorage
   */
  public getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      return null;
    }
  }

  /**
   * Make GET request
   */
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url, config);
  }

  /**
   * Make POST request
   */
  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data, config);
  }

  /**
   * Make PUT request
   */
  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.put<T>(url, data, config);
  }

  /**
   * Make DELETE request
   */
  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url, config);
  }
}

export default ApiService.getInstance();