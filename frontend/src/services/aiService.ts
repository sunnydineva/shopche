import api from './api';

/**
 * Request payload for AI product description generation
 */
export interface GenerateDescriptionRequest {
  productName: string;
  categoryId: number;
  price: number;
  currency: string;
  imageUrl?: string;
  materials?: string[];
  colors?: string[];
  currentDescription?: string;
}

/**
 * Request payload for AI social post generation
 */
export interface GenerateSocialPostRequest {
  productName: string;
  categoryId: number;
  price: number;
  currency: string;
  imageUrl?: string;
  materials?: string[];
  colors?: string[];
  currentDescription?: string;
}

/**
 * Response for AI product description generation
 */
export interface GenerateDescriptionResponse {
  description: string;
}

/**
 * Response for AI social post generation
 */
export interface GenerateSocialPostResponse {
  requestId: string;
  caption: string;
  hashtags: string[];
  fullText: string;
  tokensUsed?: number;
  timestamp?: string;
}

/**
 * Service for AI-related API calls
 */
class AiService {
  private static instance: AiService;
  private readonly BASE_URL = '/ai';

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): AiService {
    if (!AiService.instance) {
      AiService.instance = new AiService();
    }
    return AiService.instance;
  }

  /**
   * Generate product description using AI
   * @param payload Product data for description generation
   * @returns Promise with generated description
   */
  public async generateProductDescription(payload: GenerateDescriptionRequest): Promise<GenerateDescriptionResponse> {
    const response = await api.post<GenerateDescriptionResponse>(`${this.BASE_URL}/generate-description`, payload);
    return response.data;
  }

  /**
   * Generate social media post using AI
   * @param payload Product data for social post generation
   * @returns Promise with generated social post
   */
  public async generateSocialPost(payload: GenerateSocialPostRequest): Promise<GenerateSocialPostResponse> {
    const response = await api.post<GenerateSocialPostResponse>(`${this.BASE_URL}/generate-social-post`, payload);
    return response.data;
  }
}

export default AiService.getInstance();