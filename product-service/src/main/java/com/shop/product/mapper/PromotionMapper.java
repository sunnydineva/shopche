package com.shop.product.mapper;

import com.shop.product.dto.PromotionCreateDTO;
import com.shop.product.dto.PromotionDTO;
import com.shop.product.dto.PromotionUpdateDTO;
import com.shop.product.model.Promotion;
import org.springframework.stereotype.Component;

@Component
public class PromotionMapper {

    public PromotionDTO toDTO(Promotion promotion) {
        if (promotion == null) {
            return null;
        }

        PromotionDTO dto = new PromotionDTO();
        dto.setId(promotion.getId());
        dto.setProductId(promotion.getProductId());
        dto.setTitle(promotion.getTitle());
        dto.setDescription(promotion.getDescription());
        dto.setDiscountType(promotion.getDiscountType());
        dto.setDiscountValue(promotion.getDiscountValue());
        dto.setStartAt(promotion.getStartAt());
        dto.setEndAt(promotion.getEndAt());
        dto.setActive(promotion.getActive());
        dto.setPriority(promotion.getPriority());
        dto.setCreatedAt(promotion.getCreatedAt());
        dto.setUpdatedAt(promotion.getUpdatedAt());
        return dto;
    }

    public Promotion toEntity(PromotionCreateDTO dto) {
        if (dto == null) {
            return null;
        }

        Promotion promotion = new Promotion();
        promotion.setProductId(dto.getProductId());
        promotion.setTitle(dto.getTitle());
        promotion.setDescription(dto.getDescription());
        promotion.setDiscountType(dto.getDiscountType());
        promotion.setDiscountValue(dto.getDiscountValue());
        promotion.setStartAt(dto.getStartAt());
        promotion.setEndAt(dto.getEndAt());
        promotion.setActive(dto.getActive());
        promotion.setPriority(dto.getPriority());
        return promotion;
    }

    public void updateEntity(Promotion promotion, PromotionUpdateDTO dto) {
        if (promotion == null || dto == null) {
            return;
        }

        if (dto.getProductId() != null) {
            promotion.setProductId(dto.getProductId());
        }
        if (dto.getTitle() != null) {
            promotion.setTitle(dto.getTitle());
        }
        if (dto.getDescription() != null) {
            promotion.setDescription(dto.getDescription());
        }
        if (dto.getDiscountType() != null) {
            promotion.setDiscountType(dto.getDiscountType());
        }
        if (dto.getDiscountValue() != null) {
            promotion.setDiscountValue(dto.getDiscountValue());
        }
        if (dto.getStartAt() != null) {
            promotion.setStartAt(dto.getStartAt());
        }
        if (dto.getEndAt() != null) {
            promotion.setEndAt(dto.getEndAt());
        }
        if (dto.getActive() != null) {
            promotion.setActive(dto.getActive());
        }
        if (dto.getPriority() != null) {
            promotion.setPriority(dto.getPriority());
        }
    }
}
