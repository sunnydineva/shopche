package com.shop.service;

import com.shop.client.CategoryClient;
import com.shop.dto.category.CategoryCreateDTO;
import com.shop.dto.category.CategoryDTO;
import com.shop.dto.category.CategoryUpdateDTO;
import com.shop.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for managing categories through the category microservice
 */
@Service
public class CategoryServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(CategoryServiceClient.class);

    private final CategoryClient categoryClient;

    public CategoryServiceClient(CategoryClient categoryClient) {
        this.categoryClient = categoryClient;
    }

    /**
     * Get all categories
     */
    public List<CategoryDTO> getAllCategories() {
        logger.info("Fetching all categories from category service");
        return categoryClient.getAllCategories().getBody();
    }

    /**
     * Get category by ID
     */
    public CategoryDTO getCategoryById(Long id) {
        logger.info("Fetching category with ID: {} from category service", id);
        try {
            return categoryClient.getCategoryById(id).getBody();
        } catch (Exception e) {
            logger.error("Error fetching category with ID: {}", id, e);
            throw new ResourceNotFoundException("Category", "id", id);
        }
    }

    /**
     * Check if category exists by ID
     */
    public boolean existsById(Long id) {
        try {
            categoryClient.getCategoryById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Create a new category
     */
    public CategoryDTO createCategory(CategoryCreateDTO categoryCreateDTO) {
        logger.info("Creating new category: {} through category service", categoryCreateDTO.getName());
        return categoryClient.createCategory(categoryCreateDTO).getBody();
    }

    /**
     * Update an existing category
     */
    public CategoryDTO updateCategory(Long id, CategoryUpdateDTO categoryUpdateDTO) {
        logger.info("Updating category with ID: {} through category service", id);
        return categoryClient.updateCategory(id, categoryUpdateDTO).getBody();
    }

    /**
     * Delete a category
     */
    public void deleteCategory(Long id) {
        logger.info("Deleting category with ID: {} through category service", id);
        categoryClient.deleteCategory(id);
    }
}