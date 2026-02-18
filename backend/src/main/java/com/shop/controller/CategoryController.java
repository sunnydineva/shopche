package com.shop.controller;

import com.shop.dto.category.CategoryDTO;
import com.shop.service.CategoryServiceClient;
import com.shop.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller for public category endpoints
 */
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);
    private final CategoryServiceClient categoryServiceClient;
    private final ProductService productService;

    public CategoryController(CategoryServiceClient categoryServiceClient, ProductService productService) {
        this.categoryServiceClient = categoryServiceClient;
        this.productService = productService;
    }

    /**
     * Get all categories
     */
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        logger.info("Fetching all categories");
        List<CategoryDTO> categories = categoryServiceClient.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get category by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        logger.info("Fetching category with ID: {}", id);
        CategoryDTO category = categoryServiceClient.getCategoryById(id);
        return ResponseEntity.ok(category);
    }
}
