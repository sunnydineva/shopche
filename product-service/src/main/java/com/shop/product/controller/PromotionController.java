package com.shop.product.controller;

import com.shop.product.dto.PromotionCreateDTO;
import com.shop.product.dto.PromotionDTO;
import com.shop.product.dto.PromotionUpdateDTO;
import com.shop.product.service.PromotionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/promotions")
public class PromotionController {

    private final PromotionService promotionService;

    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<PromotionDTO>> getPromotionsByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(promotionService.getPromotionsByProductId(productId));
    }

    @PostMapping
    public ResponseEntity<PromotionDTO> createPromotion(@Valid @RequestBody PromotionCreateDTO dto) {
        return ResponseEntity.ok(promotionService.createPromotion(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromotionDTO> updatePromotion(@PathVariable Long id, @Valid @RequestBody PromotionUpdateDTO dto) {
        return ResponseEntity.ok(promotionService.updatePromotion(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivatePromotion(@PathVariable Long id) {
        promotionService.deactivatePromotion(id);
        return ResponseEntity.noContent().build();
    }
}
