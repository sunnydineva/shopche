package com.shop.service;

import com.shop.client.ProductClient;
import com.shop.dto.product.ProductCreateDTO;
import com.shop.dto.product.ProductDTO;
import com.shop.dto.product.ProductUpdateDTO;
import com.shop.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * Service for managing products through the product microservice
 */
@Service
public class ProductServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(ProductServiceClient.class);

    private final ProductClient productClient;

    public ProductServiceClient(ProductClient productClient) {
        this.productClient = productClient;
    }

    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        logger.info("Fetching all products through product service");
        return productClient.getAllProducts(pageable);
    }

    public Page<ProductDTO> getProductsWithFilters(Long categoryId,
                                                   BigDecimal minPrice,
                                                   BigDecimal maxPrice,
                                                   String name,
                                                   Pageable pageable) {
        logger.info("Fetching products with filters through product service");
        return productClient.getProductsWithFilters(categoryId, minPrice, maxPrice, name, pageable);
    }

    public ProductDTO getProductById(Long id) {
        return productClient.getProductById(id);
    }

    public List<ProductDTO> getProductsByCategoryId(Long categoryId) {
        ResponseEntity<List<ProductDTO>> response = productClient.getProductsByCategoryId(categoryId);
        if (response == null || response.getBody() == null) {
            throw new ResourceNotFoundException("Product", "categoryId", categoryId);
        }
        return response.getBody();
    }

    public ProductDTO createProduct(ProductCreateDTO productCreateDTO) {
        return unwrap(productClient.createProduct(productCreateDTO), "Product", 0L);
    }

    public ProductDTO updateProduct(Long id, ProductUpdateDTO productUpdateDTO) {
        return unwrap(productClient.updateProduct(id, productUpdateDTO), "Product", id);
    }

    public void deleteProduct(Long id) {
        productClient.deleteProduct(id);
    }

    private <T> T unwrap(ResponseEntity<T> response, String resourceName, Long id) {
        if (response == null || response.getBody() == null) {
            throw new ResourceNotFoundException(resourceName, "id", id);
        }
        return response.getBody();
    }
}
