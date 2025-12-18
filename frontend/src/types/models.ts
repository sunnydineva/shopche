/**
 * TypeScript interfaces for API models
 */

// User related interfaces
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserUpdateDTO {
  firstName?: string;
  lastName?: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  roles: string[];
}

// Product related interfaces
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  stockQuantity: number;
  imageUrl: string | null;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  currency: string;
  stockQuantity: number;
  imageUrl?: string;
  categoryId: number;
  isActive?: boolean;
}

export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  stockQuantity?: number;
  imageUrl?: string;
  categoryId?: number;
  isActive?: boolean;
}

// Category related interfaces
export interface Category {
  id: number;
  name: string;
  description: string;
  productCount?: number;
}

// Order related interfaces
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  userId: number;
  userEmail: string;
  orderItems: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderCreateRequest {
  items: {
    productId: number;
    quantity: number;
  }[];
}

export interface OrderStatusUpdateRequest {
  status: OrderStatus;
}

// Enums
export enum OrderStatus {
  NEW = 'NEW',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED'
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  CAD = 'CAD',
  AUD = 'AUD',
  CHF = 'CHF',
  CNY = 'CNY'
}

// Pagination related interfaces
export interface PageRequest {
  page: number;
  size: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
