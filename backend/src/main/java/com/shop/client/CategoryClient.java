package com.shop.client;

import com.shop.dto.category.CategoryCreateDTO;
import com.shop.dto.category.CategoryDTO;
import com.shop.dto.category.CategoryUpdateDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Feign client for communicating with the category service
 */
@FeignClient(name = "category-service", url = "${category-service.url}")
public interface CategoryClient {

    /**
     * Get all categories
     */
    @GetMapping("/api/categories")
    ResponseEntity<List<CategoryDTO>> getAllCategories();

    /**
     * Get category by ID
     */
    @GetMapping("/api/categories/{id}")
    ResponseEntity<CategoryDTO> getCategoryById(@PathVariable("id") Long id);
    
    /**
     * Create a new category
     */
    @PostMapping("/api/categories")
    ResponseEntity<CategoryDTO> createCategory(@RequestBody CategoryCreateDTO categoryCreateDTO);
    
    /**
     * Update an existing category
     */
    @PutMapping("/api/categories/{id}")
    ResponseEntity<CategoryDTO> updateCategory(
            @PathVariable("id") Long id,
            @RequestBody CategoryUpdateDTO categoryUpdateDTO);
    
    /**
     * Delete a category
     */
    @DeleteMapping("/api/categories/{id}")
    ResponseEntity<Void> deleteCategory(@PathVariable("id") Long id);
}