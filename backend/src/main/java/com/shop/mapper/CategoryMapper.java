package com.shop.mapper;

import com.shop.dto.category.CategoryCreateDTO;
import com.shop.dto.category.CategoryDTO;
import com.shop.dto.category.CategoryUpdateDTO;
import com.shop.model.Category;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting between Category entity and DTOs
 */
@Component
public class CategoryMapper {

    /**
     * Convert Category entity to CategoryDTO
     */
    public CategoryDTO toDTO(Category category) {
        if (category == null) {
            return null;
        }

        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        
        // Set product count if products are loaded
        if (category.getProducts() != null) {
            dto.setProductCount(category.getProducts().size());
        }

        return dto;
    }

    /**
     * Convert list of Category entities to list of CategoryDTOs
     */
    public List<CategoryDTO> toDTOList(List<Category> categories) {
        return categories.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convert CategoryCreateDTO to Category entity
     */
    public Category toEntity(CategoryCreateDTO dto) {
        if (dto == null) {
            return null;
        }

        Category category = new Category();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());

        return category;
    }

    /**
     * Update Category entity from CategoryUpdateDTO
     */
    public void updateEntity(Category category, CategoryUpdateDTO dto) {
        if (dto == null || category == null) {
            return;
        }

        if (dto.getName() != null) {
            category.setName(dto.getName());
        }

        if (dto.getDescription() != null) {
            category.setDescription(dto.getDescription());
        }
    }
}