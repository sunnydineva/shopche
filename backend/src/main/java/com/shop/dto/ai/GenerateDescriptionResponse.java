package com.shop.dto.ai;

/**
 * Response DTO for AI product description generation
 */
public class GenerateDescriptionResponse {
    private String description;

    // Default constructor
    public GenerateDescriptionResponse() {}

    // Constructor
    public GenerateDescriptionResponse(String description) {
        this.description = description;
    }

    // Getters and setters
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}