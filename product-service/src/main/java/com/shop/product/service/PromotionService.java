package com.shop.product.service;

import com.shop.product.dto.PromotionCreateDTO;
import com.shop.product.dto.PromotionDTO;
import com.shop.product.dto.PromotionUpdateDTO;
import com.shop.product.exception.ResourceNotFoundException;
import com.shop.product.mapper.PromotionMapper;
import com.shop.product.model.Promotion;
import com.shop.product.repository.ProductRepository;
import com.shop.product.repository.PromotionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PromotionService {

    private static final Logger logger = LoggerFactory.getLogger(PromotionService.class);

    private final PromotionRepository promotionRepository;
    private final ProductRepository productRepository;
    private final PromotionMapper promotionMapper;

    public PromotionService(PromotionRepository promotionRepository,
                            ProductRepository productRepository,
                            PromotionMapper promotionMapper) {
        this.promotionRepository = promotionRepository;
        this.productRepository = productRepository;
        this.promotionMapper = promotionMapper;
    }

    @Transactional(readOnly = true)
    public List<PromotionDTO> getPromotionsByProductId(Long productId) {
        return promotionRepository.findByProductId(productId).stream()
                .map(promotionMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<Promotion> getActivePromotionEntity(Long productId) {
        LocalDateTime now = LocalDateTime.now();
        return promotionRepository
                .findFirstByProductIdAndActiveTrueAndStartAtLessThanEqualAndEndAtGreaterThanEqualOrderByPriorityDescCreatedAtDesc(
                        productId, now, now);
    }

    @Transactional(readOnly = true)
    public PromotionDTO getActivePromotion(Long productId) {
        return getActivePromotionEntity(productId).map(promotionMapper::toDTO).orElse(null);
    }

    @Transactional(readOnly = true)
    public PromotionDTO toDTO(Promotion promotion) {
        return promotionMapper.toDTO(promotion);
    }

    @Transactional(readOnly = true)
    public BigDecimal calculateEffectivePrice(BigDecimal basePrice, Promotion promotion) {
        if (basePrice == null) {
            return null;
        }
        return promotion == null ? basePrice : promotion.applyTo(basePrice);
    }

    @Transactional
    public PromotionDTO createPromotion(PromotionCreateDTO dto) {
        validateProductExists(dto.getProductId());
        Promotion promotion = promotionMapper.toEntity(dto);
        Promotion saved = promotionRepository.save(promotion);
        logger.info("Created promotion {} for product {}", saved.getId(), saved.getProductId());
        return promotionMapper.toDTO(saved);
    }

    @Transactional
    public PromotionDTO updatePromotion(Long id, PromotionUpdateDTO dto) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion", "id", id));

        if (dto.getProductId() != null) {
            validateProductExists(dto.getProductId());
        }

        promotionMapper.updateEntity(promotion, dto);
        Promotion updated = promotionRepository.save(promotion);
        logger.info("Updated promotion {}", updated.getId());
        return promotionMapper.toDTO(updated);
    }

    @Transactional
    public void deactivatePromotion(Long id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion", "id", id));
        promotion.setActive(false);
        promotionRepository.save(promotion);
    }

    private void validateProductExists(Long productId) {
        if (productId == null || !productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product", "id", productId);
        }
    }
}
