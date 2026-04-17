package com.shop.product.service;

import com.shop.product.dto.CategoryDTO;
import com.shop.product.dto.ProductCreateDTO;
import com.shop.product.dto.ProductDTO;
import com.shop.product.dto.ProductUpdateDTO;
import com.shop.product.exception.ResourceNotFoundException;
import com.shop.product.mapper.ProductMapper;
import com.shop.product.model.Product;
import com.shop.product.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;
    private final CategoryServiceClient categoryServiceClient;
    private final ProductMapper productMapper;

    public ProductService(ProductRepository productRepository,
                          CategoryServiceClient categoryServiceClient,
                          ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.categoryServiceClient = categoryServiceClient;
        this.productMapper = productMapper;
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        Page<Product> products = productRepository.findByIsActiveTrue(pageable);
        return products.map(productMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getProductsWithFilters(Long categoryId,
                                                   BigDecimal minPrice,
                                                   BigDecimal maxPrice,
                                                   String name,
                                                   Pageable pageable) {
        Page<Product> products = productRepository.findProductsByFilters(categoryId, minPrice, maxPrice, name, pageable);
        return products.map(productMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        return productMapper.toDTO(findProductById(id));
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getProductsByCategoryId(Long categoryId) {
        if (!categoryServiceClient.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category", "id", categoryId);
        }
        return productMapper.toDTOList(productRepository.findByCategoryId(categoryId));
    }

    @Transactional
    public ProductDTO createProduct(ProductCreateDTO dto) {
        CategoryDTO categoryDTO = categoryServiceClient.getCategoryById(dto.getCategoryId());
        Product product = productMapper.toEntity(dto);
        productMapper.setCategory(product, categoryDTO.getId(), categoryDTO.getName());
        Product saved = productRepository.save(product);
        logger.info("Created product {}", saved.getId());
        return productMapper.toDTO(saved);
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductUpdateDTO dto) {
        Product product = findProductById(id);

        if (dto.getCategoryId() != null &&
                (product.getCategoryId() == null || !product.getCategoryId().equals(dto.getCategoryId()))) {
            CategoryDTO categoryDTO = categoryServiceClient.getCategoryById(dto.getCategoryId());
            productMapper.setCategory(product, categoryDTO.getId(), categoryDTO.getName());
        }

        productMapper.updateEntity(product, dto);
        Product updated = productRepository.save(product);
        logger.info("Updated product {}", updated.getId());
        return productMapper.toDTO(updated);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = findProductById(id);
        product.setIsActive(false);
        productRepository.save(product);
    }

    private Product findProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
    }
}
