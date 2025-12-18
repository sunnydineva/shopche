import api from './api';
import { Category } from '../types/models';

/**
 * Service for category-related API calls
 */
class CategoryService {
  private static instance: CategoryService;
  private readonly BASE_URL = '/categories';

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }
    return CategoryService.instance;
  }

  /**
   * Get all categories
   * @returns Promise with categories
   */
  public async getCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>(this.BASE_URL);
    return response.data;
  }

  /**
   * Get category by ID
   * @param id Category ID
   * @returns Promise with category
   */
  public async getCategoryById(id: number): Promise<Category> {
    const response = await api.get<Category>(`${this.BASE_URL}/${id}`);
    return response.data;
  }
}

export default CategoryService.getInstance();