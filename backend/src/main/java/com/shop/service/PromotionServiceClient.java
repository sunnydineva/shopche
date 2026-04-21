package com.shop.service;

import com.shop.client.PromotionClient;
import com.shop.dto.product.PromotionCreateDTO;
import com.shop.dto.product.PromotionDTO;
import com.shop.dto.product.PromotionUpdateDTO;
import com.shop.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PromotionServiceClient {

    private final PromotionClient promotionClient;

    public PromotionServiceClient(PromotionClient promotionClient) {
        this.promotionClient = promotionClient;
    }

    public List<PromotionDTO> getPromotionsByProductId(Long productId) {
        var response = promotionClient.getPromotionsByProductId(productId);
        if (response == null || response.getBody() == null) {
            throw new ResourceNotFoundException("Promotion", "productId", productId);
        }
        return response.getBody();
    }

    public PromotionDTO createPromotion(PromotionCreateDTO dto) {
        return unwrap(promotionClient.createPromotion(dto), "Promotion", dto.getProductId());
    }

    public PromotionDTO updatePromotion(Long id, PromotionUpdateDTO dto) {
        return unwrap(promotionClient.updatePromotion(id, dto), "Promotion", id);
    }

    public void deactivatePromotion(Long id) {
        promotionClient.deactivatePromotion(id);
    }

    private <T> T unwrap(org.springframework.http.ResponseEntity<T> response, String resourceName, Long id) {
        if (response == null || response.getBody() == null) {
            throw new ResourceNotFoundException(resourceName, "id", id);
        }
        return response.getBody();
    }
}
