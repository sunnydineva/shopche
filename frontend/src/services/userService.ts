import api from './api';
import { User, UserUpdateDTO, Page, PageRequest } from '../types/models';

/**
 * Service for user-related API calls
 */
class UserService {
  private static instance: UserService;
  private readonly BASE_URL = '/user';
  private readonly ADMIN_BASE_URL = '/admin/users';

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Get current user profile
   * @returns Promise with user data
   */
  public async getCurrentUser(): Promise<User> {
    const response = await api.get<User>(`${this.BASE_URL}/me`);
    return response.data;
  }

  /**
   * Update current user profile
   * @param userData Updated user data
   * @returns Promise with updated user
   */
  public async updateCurrentUser(userData: UserUpdateDTO): Promise<User> {
    const response = await api.put<User>(`${this.BASE_URL}/me`, userData);
    return response.data;
  }

  /**
   * Get all users with pagination (admin only)
   * @param pageRequest Pagination parameters
   * @returns Promise with paginated users
   */
  public async getAdminUsers(pageRequest: PageRequest): Promise<Page<User>> {
    const { page, size, sort, direction } = pageRequest;

    let url = `${this.ADMIN_BASE_URL}?page=${page}&size=${size}`;

    if (sort) {
      url += `&sort=${sort}`;
    }

    if (direction) {
      url += `&direction=${direction}`;
    }

    const response = await api.get<Page<User>>(url);
    return response.data;
  }

  /**
   * Get user by ID (admin only)
   * @param id User ID
   * @returns Promise with user
   */
  public async getUserById(id: number): Promise<User> {
    const response = await api.get<User>(`${this.ADMIN_BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Update user (admin only)
   * @param id User ID
   * @param userData Updated user data
   * @returns Promise with updated user
   */
  public async updateUser(id: number, userData: any): Promise<User> {
    const response = await api.put<User>(`${this.ADMIN_BASE_URL}/${id}`, userData);
    return response.data;
  }

  /**
   * Deactivate user (admin only)
   * @param id User ID
   * @returns Promise with success message
   */
  public async deactivateUser(id: number): Promise<any> {
    const response = await api.delete(`${this.ADMIN_BASE_URL}/${id}`);
    return response.data;
  }
}

export default UserService.getInstance();
