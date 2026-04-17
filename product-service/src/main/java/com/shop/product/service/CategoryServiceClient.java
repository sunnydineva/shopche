package com.shop.product.service;

import com.shop.product.client.CategoryClient;
import com.shop.product.dto.CategoryDTO;
import com.shop.product.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class CategoryServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(CategoryServiceClient.class);

    private final CategoryClient categoryClient;

    public CategoryServiceClient(CategoryClient categoryClient) {
        this.categoryClient = categoryClient;
    }

    public CategoryDTO getCategoryById(Long id) {
        try {
            CategoryDTO category = categoryClient.getCategoryById(id).getBody();
            if (category == null) {
                throw new ResourceNotFoundException("Category", "id", id);
            }
            return category;
        } catch (Exception e) {
            logger.error("Error fetching category with ID: {}", id, e);
            throw new ResourceNotFoundException("Category", "id", id);
        }
    }

    public boolean existsById(Long id) {
        try {
            return getCategoryById(id) != null;
        } catch (Exception e) {
            return false;
        }
    }
}
