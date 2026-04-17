package com.shop.client;

import com.shop.dto.product.ProductCreateDTO;
import com.shop.dto.product.ProductDTO;
import com.shop.dto.product.ProductUpdateDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.List;

/**
 * Feign client for communicating with the product service
 */
@FeignClient(name = "product-service", url = "${product-service.url}")
public interface ProductClient
{
    /**
     * Get all products
     */
    @GetMapping("/api/products")
    Page<ProductDTO> getAllProducts(Pageable pageable);

    /**
     * Get products with filters
     */
    @GetMapping("/api/products")
    Page<ProductDTO> getProductsWithFilters(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String name,
            Pageable pageable);

    /**
     * Get product by ID
     */
    @GetMapping("/api/products/{id}")
    ProductDTO getProductById(@PathVariable Long id);

    @GetMapping("/api/products/category/{categoryId}")
    ResponseEntity<List<ProductDTO>> getProductsByCategoryId(@PathVariable Long categoryId);

    /**
     * Create a new product
     */
    @PostMapping("/api/products")
    ResponseEntity<ProductDTO> createProduct(@RequestBody ProductCreateDTO productCreateDTO);

    /**
     * Update an existing product
     */
    @PutMapping("/api/products/{id}")
    ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductUpdateDTO productUpdateDTO);

    /**
     * Delete a product
     */
    @DeleteMapping("/api/products/{id}")
    ResponseEntity<Void> deleteProduct(@PathVariable Long id);

}
