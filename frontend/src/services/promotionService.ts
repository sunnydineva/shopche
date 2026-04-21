import api from './api';
import { Promotion, PromotionCreateRequest, PromotionUpdateRequest } from '../types/models';

class PromotionService {
  private static instance: PromotionService;
  private readonly BASE_URL = '/admin/promotions';

  private constructor() {}

  public static getInstance(): PromotionService {
    if (!PromotionService.instance) {
      PromotionService.instance = new PromotionService();
    }
    return PromotionService.instance;
  }

  public async getPromotionsByProductId(productId: number): Promise<Promotion[]> {
    const response = await api.get<Promotion[]>(`${this.BASE_URL}/product/${productId}`);
    return response.data;
  }

  public async createPromotion(promotion: PromotionCreateRequest): Promise<Promotion> {
    const response = await api.post<Promotion>(this.BASE_URL, promotion);
    return response.data;
  }

  public async updatePromotion(id: number, promotion: PromotionUpdateRequest): Promise<Promotion> {
    const response = await api.put<Promotion>(`${this.BASE_URL}/${id}`, promotion);
    return response.data;
  }

  public async deactivatePromotion(id: number): Promise<void> {
    await api.delete(`${this.BASE_URL}/${id}`);
  }
}

export default PromotionService.getInstance();
