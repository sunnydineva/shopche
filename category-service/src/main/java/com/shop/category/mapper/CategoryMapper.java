package com.shop.category.mapper;

import com.shop.category.dto.CategoryCreateDTO;
import com.shop.category.dto.CategoryDTO;
import com.shop.category.dto.CategoryUpdateDTO;
import com.shop.category.model.Category;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting between Category entities and DTOs
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
        
        return new CategoryDTO(
                category.getId(),
                category.getName(),
                category.getDescription()
        );
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
    public Category toEntity(CategoryCreateDTO categoryCreateDTO) {
        if (categoryCreateDTO == null) {
            return null;
        }
        
        Category category = new Category();
        category.setName(categoryCreateDTO.getName());
        category.setDescription(categoryCreateDTO.getDescription());
        
        return category;
    }
    
    /**
     * Update Category entity with data from CategoryUpdateDTO
     */
    public void updateEntity(Category category, CategoryUpdateDTO categoryUpdateDTO) {
        if (categoryUpdateDTO == null) {
            return;
        }
        
        if (categoryUpdateDTO.getName() != null) {
            category.setName(categoryUpdateDTO.getName());
        }
        
        if (categoryUpdateDTO.getDescription() != null) {
            category.setDescription(categoryUpdateDTO.getDescription());
        }
    }
}