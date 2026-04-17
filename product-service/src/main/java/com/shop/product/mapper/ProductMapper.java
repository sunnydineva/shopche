package com.shop.product.mapper;

import com.shop.product.dto.ProductCreateDTO;
import com.shop.product.dto.ProductDTO;
import com.shop.product.dto.ProductUpdateDTO;
import com.shop.product.model.Product;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

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
        dto.setCategoryId(product.getCategoryId());
        dto.setCategoryName(product.getCategoryName());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        dto.setIsActive(product.getIsActive());
        return dto;
    }

    public List<ProductDTO> toDTOList(List<Product> products) {
        return products.stream().map(this::toDTO).collect(Collectors.toList());
    }

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

    public void setCategory(Product product, Long categoryId, String categoryName) {
        if (product != null) {
            product.setCategoryId(categoryId);
            product.setCategoryName(categoryName);
        }
    }
}
