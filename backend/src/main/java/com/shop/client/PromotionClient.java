package com.shop.client;

import com.shop.dto.product.PromotionCreateDTO;
import com.shop.dto.product.PromotionDTO;
import com.shop.dto.product.PromotionUpdateDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "product-service-promotions", url = "${product-service.url}")
public interface PromotionClient {

    @GetMapping("/api/admin/promotions/product/{productId}")
    ResponseEntity<List<PromotionDTO>> getPromotionsByProductId(@PathVariable Long productId);

    @PostMapping("/api/admin/promotions")
    ResponseEntity<PromotionDTO> createPromotion(@RequestBody PromotionCreateDTO dto);

    @PutMapping("/api/admin/promotions/{id}")
    ResponseEntity<PromotionDTO> updatePromotion(@PathVariable Long id, @RequestBody PromotionUpdateDTO dto);

    @DeleteMapping("/api/admin/promotions/{id}")
    ResponseEntity<Void> deactivatePromotion(@PathVariable Long id);
}
