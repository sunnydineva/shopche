package com.shop.dto.category;

import jakarta.validation.constraints.NotBlank;

/**
 * Data Transfer Object for Category creation requests
 */
public class CategoryCreateDTO {
    
    @NotBlank(message = "Category name is required")
    private String name;
    
    private String description;

    // Constructors
    public CategoryCreateDTO() {
    }

    public CategoryCreateDTO(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}