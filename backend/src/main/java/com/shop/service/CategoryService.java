package com.shop.service;

import com.shop.dto.category.CategoryCreateDTO;
import com.shop.dto.category.CategoryDTO;
import com.shop.dto.category.CategoryUpdateDTO;
import com.shop.exception.ResourceNotFoundException;
import com.shop.mapper.CategoryMapper;
import com.shop.model.Category;
import com.shop.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for managing categories
 */
@Service
public class CategoryService {

    private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    /**
     * Get all categories
     */
    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        logger.info("Fetching all categories");
        List<Category> categories = categoryRepository.findAll();
        return categoryMapper.toDTOList(categories);
    }

    /**
     * Get category by ID
     */
    @Transactional(readOnly = true)
    public CategoryDTO getCategoryById(Long id) {
        logger.info("Fetching category with ID: {}", id);
        Category category = findCategoryById(id);
        return categoryMapper.toDTO(category);
    }

    /**
     * Create a new category
     */
    @Transactional
    public CategoryDTO createCategory(CategoryCreateDTO categoryCreateDTO) {
        logger.info("Creating new category: {}", categoryCreateDTO.getName());
        
        // Check if category with the same name already exists
        if (categoryRepository.existsByName(categoryCreateDTO.getName())) {
            logger.error("Category with name '{}' already exists", categoryCreateDTO.getName());
            throw new IllegalArgumentException("Category with name '" + categoryCreateDTO.getName() + "' already exists");
        }
        
        Category category = categoryMapper.toEntity(categoryCreateDTO);
        Category savedCategory = categoryRepository.save(category);
        
        logger.info("Category created with ID: {}", savedCategory.getId());
        return categoryMapper.toDTO(savedCategory);
    }

    /**
     * Update an existing category
     */
    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryUpdateDTO categoryUpdateDTO) {
        logger.info("Updating category with ID: {}", id);
        
        Category category = findCategoryById(id);
        
        // Check if new name is already taken by another category
        if (categoryUpdateDTO.getName() != null && 
            !categoryUpdateDTO.getName().equals(category.getName()) && 
            categoryRepository.existsByName(categoryUpdateDTO.getName())) {
            logger.error("Category with name '{}' already exists", categoryUpdateDTO.getName());
            throw new IllegalArgumentException("Category with name '" + categoryUpdateDTO.getName() + "' already exists");
        }
        
        categoryMapper.updateEntity(category, categoryUpdateDTO);
        Category updatedCategory = categoryRepository.save(category);
        
        logger.info("Category updated: {}", updatedCategory.getId());
        return categoryMapper.toDTO(updatedCategory);
    }

    /**
     * Delete a category
     */
    @Transactional
    public void deleteCategory(Long id) {
        logger.info("Deleting category with ID: {}", id);
        
        Category category = findCategoryById(id);
        
        // Check if category has products
        if (category.getProducts() != null && !category.getProducts().isEmpty()) {
            logger.error("Cannot delete category with ID: {} because it has associated products", id);
            throw new IllegalStateException("Cannot delete category because it has associated products");
        }
        
        categoryRepository.delete(category);
        logger.info("Category deleted: {}", id);
    }

    /**
     * Helper method to find category by ID
     */
    private Category findCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Category not found with ID: {}", id);
                    return new ResourceNotFoundException("Category", "id", id);
                });
    }
}