package com.shop.service;

import com.shop.dto.product.ProductCreateDTO;
import com.shop.dto.product.ProductDTO;
import com.shop.dto.product.ProductUpdateDTO;
import com.shop.exception.ResourceNotFoundException;
import com.shop.mapper.ProductMapper;
import com.shop.model.Category;
import com.shop.model.Product;
import com.shop.repository.CategoryRepository;
import com.shop.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * Service for managing products
 */
@Service
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    public ProductService(ProductRepository productRepository, 
                         CategoryRepository categoryRepository,
                         ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productMapper = productMapper;
    }

    /**
     * Get all products with pagination
     */
    @Transactional(readOnly = true)
    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        logger.info("Fetching all products with pagination");
        Page<Product> products = productRepository.findByIsActiveTrue(pageable);
        return products.map(productMapper::toDTO);
    }

    /**
     * Get products with filters and pagination
     */
    @Transactional(readOnly = true)
    public Page<ProductDTO> getProductsWithFilters(
            Long categoryId, 
            BigDecimal minPrice, 
            BigDecimal maxPrice, 
            String name, 
            Pageable pageable) {
        
        logger.info("Fetching products with filters: categoryId={}, minPrice={}, maxPrice={}, name={}", 
                categoryId, minPrice, maxPrice, name);
        
        Page<Product> products = productRepository.findProductsByFilters(
                categoryId, minPrice, maxPrice, name, pageable);
        
        return products.map(productMapper::toDTO);
    }

    /**
     * Get product by ID
     */
    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        logger.info("Fetching product with ID: {}", id);
        Product product = findProductById(id);
        return productMapper.toDTO(product);
    }

    /**
     * Get products by category ID
     */
    @Transactional(readOnly = true)
    public List<ProductDTO> getProductsByCategoryId(Long categoryId) {
        logger.info("Fetching products by category ID: {}", categoryId);
        
        // Check if category exists
        if (!categoryRepository.existsById(categoryId)) {
            logger.error("Category not found with ID: {}", categoryId);
            throw new ResourceNotFoundException("Category", "id", categoryId);
        }
        
        List<Product> products = productRepository.findByCategoryId(categoryId);
        return productMapper.toDTOList(products);
    }

    /**
     * Create a new product
     */
    @Transactional
    public ProductDTO createProduct(ProductCreateDTO productCreateDTO) {
        logger.info("Creating new product: {}", productCreateDTO.getName());
        
        // Check if category exists
        Category category = categoryRepository.findById(productCreateDTO.getCategoryId())
                .orElseThrow(() -> {
                    logger.error("Category not found with ID: {}", productCreateDTO.getCategoryId());
                    return new ResourceNotFoundException("Category", "id", productCreateDTO.getCategoryId());
                });
        
        Product product = productMapper.toEntity(productCreateDTO);
        productMapper.setCategory(product, category);
        
        Product savedProduct = productRepository.save(product);
        logger.info("Product created with ID: {}", savedProduct.getId());
        
        return productMapper.toDTO(savedProduct);
    }

    /**
     * Update an existing product
     */
    @Transactional
    public ProductDTO updateProduct(Long id, ProductUpdateDTO productUpdateDTO) {
        logger.info("Updating product with ID: {}", id);
        
        Product product = findProductById(id);
        
        // Update category if provided
        if (productUpdateDTO.getCategoryId() != null && 
            (product.getCategory() == null || !product.getCategory().getId().equals(productUpdateDTO.getCategoryId()))) {
            
            Category category = categoryRepository.findById(productUpdateDTO.getCategoryId())
                    .orElseThrow(() -> {
                        logger.error("Category not found with ID: {}", productUpdateDTO.getCategoryId());
                        return new ResourceNotFoundException("Category", "id", productUpdateDTO.getCategoryId());
                    });
            
            productMapper.setCategory(product, category);
        }
        
        productMapper.updateEntity(product, productUpdateDTO);
        Product updatedProduct = productRepository.save(product);
        
        logger.info("Product updated: {}", updatedProduct.getId());
        return productMapper.toDTO(updatedProduct);
    }

    /**
     * Delete (deactivate) a product
     */
    @Transactional
    public void deleteProduct(Long id) {
        logger.info("Deactivating product with ID: {}", id);
        
        Product product = findProductById(id);
        product.setIsActive(false);
        productRepository.save(product);
        
        logger.info("Product deactivated: {}", id);
    }

    /**
     * Helper method to find product by ID
     */
    private Product findProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Product not found with ID: {}", id);
                    return new ResourceNotFoundException("Product", "id", id);
                });
    }
}