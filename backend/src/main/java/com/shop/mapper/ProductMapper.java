package com.shop.mapper;

import com.shop.dto.product.ProductCreateDTO;
import com.shop.dto.product.ProductDTO;
import com.shop.dto.product.ProductUpdateDTO;
import com.shop.model.Category;
import com.shop.model.Product;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting between Product entity and DTOs
 */
@Component
public class ProductMapper {

    /**
     * Convert Product entity to ProductDTO
     */
    public ProductDTO toDTO(Product product) {
        if (product == null) {
            return null;
        }

        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setCurrency(product.getCurrency());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setImageUrl(product.getImageUrl());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        dto.setIsActive(product.getIsActive());

        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }

        return dto;
    }

    /**
     * Convert list of Product entities to list of ProductDTOs
     */
    public List<ProductDTO> toDTOList(List<Product> products) {
        return products.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convert ProductCreateDTO to Product entity
     */
    public Product toEntity(ProductCreateDTO dto) {
        if (dto == null) {
            return null;
        }

        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCurrency(dto.getCurrency());
        product.setStockQuantity(dto.getStockQuantity());
        product.setImageUrl(dto.getImageUrl());
        product.setIsActive(true);

        return product;
    }

    /**
     * Update Product entity from ProductUpdateDTO
     */
    public void updateEntity(Product product, ProductUpdateDTO dto) {
        if (dto == null || product == null) {
            return;
        }

        if (dto.getName() != null) {
            product.setName(dto.getName());
        }

        if (dto.getDescription() != null) {
            product.setDescription(dto.getDescription());
        }

        if (dto.getPrice() != null) {
            product.setPrice(dto.getPrice());
        }

        if (dto.getCurrency() != null) {
            product.setCurrency(dto.getCurrency());
        }

        if (dto.getStockQuantity() != null) {
            product.setStockQuantity(dto.getStockQuantity());
        }

        if (dto.getImageUrl() != null) {
            product.setImageUrl(dto.getImageUrl());
        }

        if (dto.getIsActive() != null) {
            product.setIsActive(dto.getIsActive());
        }

        product.setUpdatedAt(LocalDateTime.now());
    }

    /**
     * Set category for product
     */
    public void setCategory(Product product, Category category) {
        if (product != null && category != null) {
            product.setCategory(category);
        }
    }
}