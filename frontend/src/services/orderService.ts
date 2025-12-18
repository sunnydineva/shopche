import api from './api';
import { Order, OrderCreateRequest, OrderStatusUpdateRequest, Page, PageRequest } from '../types/models';

/**
 * Service for order-related API calls
 */
class OrderService {
  private static instance: OrderService;
  private readonly USER_BASE_URL = '/user/orders';
  private readonly ADMIN_BASE_URL = '/admin/orders';

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  /**
   * Get user orders with pagination
   * @param pageRequest Pagination parameters
   * @returns Promise with paginated orders
   */
  public async getUserOrders(pageRequest: PageRequest): Promise<Page<Order>> {
    const { page, size, sort, direction } = pageRequest;
    
    let url = `${this.USER_BASE_URL}?page=${page}&size=${size}`;
    
    if (sort) {
      url += `&sort=${sort}`;
    }
    
    if (direction) {
      url += `&direction=${direction}`;
    }
    
    const response = await api.get<Page<Order>>(url);
    return response.data;
  }

  /**
   * Create new order
   * @param orderRequest Order data
   * @returns Promise with created order
   */
  public async createOrder(orderRequest: OrderCreateRequest): Promise<Order> {
    const response = await api.post<Order>(this.USER_BASE_URL, orderRequest);
    return response.data;
  }

  /**
   * Get all orders for admin with pagination
   * @param pageRequest Pagination parameters
   * @returns Promise with paginated orders
   */
  public async getAdminOrders(pageRequest: PageRequest): Promise<Page<Order>> {
    const { page, size, sort, direction } = pageRequest;
    
    let url = `${this.ADMIN_BASE_URL}?page=${page}&size=${size}`;
    
    if (sort) {
      url += `&sort=${sort}`;
    }
    
    if (direction) {
      url += `&direction=${direction}`;
    }
    
    const response = await api.get<Page<Order>>(url);
    return response.data;
  }

  /**
   * Update order status (admin only)
   * @param id Order ID
   * @param statusUpdate Status update data
   * @returns Promise with updated order
   */
  public async updateOrderStatus(id: number, statusUpdate: OrderStatusUpdateRequest): Promise<Order> {
    const response = await api.put<Order>(`${this.ADMIN_BASE_URL}/${id}/status`, statusUpdate);
    return response.data;
  }
}

export default OrderService.getInstance();