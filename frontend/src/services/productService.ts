import api from './api';
import { Page, PageRequest, Product, ProductCreateRequest, ProductUpdateRequest } from '../types/models';

/**
 * Service for product-related API calls
 */
class ProductService {
  private static instance: ProductService;
  private readonly BASE_URL = '/products';
  private readonly ADMIN_BASE_URL = '/admin/products';

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  /**
   * Get all products with pagination and filtering
   * @param pageRequest Pagination parameters
   * @param categoryId Optional category filter
   * @param minPrice Optional minimum price filter
   * @param maxPrice Optional maximum price filter
   * @param name Optional name search filter
   * @returns Promise with paginated products
   */
  public async getProducts(
    pageRequest: PageRequest,
    categoryId?: number,
    minPrice?: number,
    maxPrice?: number,
    name?: string
  ): Promise<Page<Product>> {
    const { page, size, sort, direction } = pageRequest;
    
    let url = `${this.BASE_URL}?page=${page}&size=${size}`;
    
    if (sort) {
      url += `&sort=${sort}`;
    }
    
    if (direction) {
      url += `&direction=${direction}`;
    }
    
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }
    
    if (minPrice) {
      url += `&minPrice=${minPrice}`;
    }
    
    if (maxPrice) {
      url += `&maxPrice=${maxPrice}`;
    }
    
    if (name) {
      url += `&name=${encodeURIComponent(name)}`;
    }
    
    const response = await api.get<Page<Product>>(url);
    return response.data;
  }

  /**
   * Get product by ID
   * @param id Product ID
   * @returns Promise with product
   */
  public async getProductById(id: number): Promise<Product> {
    const response = await api.get<Product>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Get all products for admin with pagination
   * @param pageRequest Pagination parameters
   * @returns Promise with paginated products
   */
  public async getAdminProducts(pageRequest: PageRequest): Promise<Page<Product>> {
    const { page, size, sort, direction } = pageRequest;
    
    let url = `${this.ADMIN_BASE_URL}?page=${page}&size=${size}`;
    
    if (sort) {
      url += `&sort=${sort}`;
    }
    
    if (direction) {
      url += `&direction=${direction}`;
    }
    
    const response = await api.get<Page<Product>>(url);
    return response.data;
  }

  /**
   * Create new product (admin only)
   * @param product Product data
   * @returns Promise with created product
   */
  public async createProduct(product: ProductCreateRequest): Promise<Product> {
    const response = await api.post<Product>(this.ADMIN_BASE_URL, product);
    return response.data;
  }

  /**
   * Update product (admin only)
   * @param id Product ID
   * @param product Updated product data
   * @returns Promise with updated product
   */
  public async updateProduct(id: number, product: ProductUpdateRequest): Promise<Product> {
    const response = await api.put<Product>(`${this.ADMIN_BASE_URL}/${id}`, product);
    return response.data;
  }

  /**
   * Delete product (admin only)
   * @param id Product ID
   * @returns Promise with success message
   */
  public async deleteProduct(id: number): Promise<any> {
    const response = await api.delete(`${this.ADMIN_BASE_URL}/${id}`);
    return response.data;
  }
}

export default ProductService.getInstance();