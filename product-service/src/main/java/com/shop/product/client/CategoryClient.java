package com.shop.product.client;

import com.shop.product.dto.CategoryDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "category-service", url = "${category-service.url}")
public interface CategoryClient {

    @GetMapping("/api/categories/{id}")
    ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id);
}
