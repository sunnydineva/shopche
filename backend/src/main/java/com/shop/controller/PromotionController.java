package com.shop.controller;

import com.shop.dto.product.PromotionCreateDTO;
import com.shop.dto.product.PromotionDTO;
import com.shop.dto.product.PromotionUpdateDTO;
import com.shop.service.PromotionServiceClient;
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

    private final PromotionServiceClient promotionServiceClient;

    public PromotionController(PromotionServiceClient promotionServiceClient) {
        this.promotionServiceClient = promotionServiceClient;
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<PromotionDTO>> getPromotionsByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(promotionServiceClient.getPromotionsByProductId(productId));
    }

    @PostMapping
    public ResponseEntity<PromotionDTO> createPromotion(@Valid @RequestBody PromotionCreateDTO dto) {
        return ResponseEntity.ok(promotionServiceClient.createPromotion(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromotionDTO> updatePromotion(@PathVariable Long id, @Valid @RequestBody PromotionUpdateDTO dto) {
        return ResponseEntity.ok(promotionServiceClient.updatePromotion(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivatePromotion(@PathVariable Long id) {
        promotionServiceClient.deactivatePromotion(id);
        return ResponseEntity.noContent().build();
    }
}
