package com.shop.controller;

import com.shop.dto.product.ProductDTO;
import com.shop.service.ProductServiceClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Arrays;

/**
 * Controller for public product endpoints
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    private final ProductServiceClient productService;

    public ProductController(ProductServiceClient productService) {
        this.productService = productService;
    }

    /**
     * Get all products with optional filtering and pagination
     */
    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "asc") String direction) {

        logger.info("Fetching products with filters: categoryId={}, minPrice={}, maxPrice={}, name={}, page={}, size={}, sort={}, direction={}",
                categoryId, minPrice, maxPrice, name, page, size, sort, direction);

        Pageable pageable = PageRequest.of(page, size, buildSort(sort, direction));

        Page<ProductDTO> products;
        if (categoryId != null || minPrice != null || maxPrice != null || name != null) {
            products = productService.getProductsWithFilters(categoryId, minPrice, maxPrice, name, pageable);
        } else {
            products = productService.getAllProducts(pageable);
        }

        return ResponseEntity.ok(products);
    }

    /**
     * Get product by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        logger.info("Fetching product with ID: {}", id);
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    private Sort buildSort(String sort, String direction) {
        if (sort != null && sort.contains(",")) {
            String[] parts = Arrays.stream(sort.split(","))
                    .map(String::trim)
                    .toArray(String[]::new);
            if (parts.length == 2) {
                Sort.Direction parsedDirection = parts[1].equalsIgnoreCase("desc")
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;
                return Sort.by(parsedDirection, parts[0]);
            }
        }

        Sort.Direction sortDirection = direction != null && direction.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        return Sort.by(sortDirection, sort == null || sort.isBlank() ? "id" : sort);
    }
}
