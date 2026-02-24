package com.shop.ai.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import java.util.List;

/**
 * Request DTO for AI product description generation
 */
public class GenerateDescriptionRequest {

    @NotBlank(message = "Product name is required")
    private String productName;

    private String category;
    private List<String> features;
    private String targetAudience;

    // Default constructor
    public GenerateDescriptionRequest() {}

    // Constructor
    public GenerateDescriptionRequest(String productName, String category, List<String> features, String targetAudience) {
        this.productName = productName;
        this.category = category;
        this.features = features;
        this.targetAudience = targetAudience;
    }

    // Getters and setters
    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<String> getFeatures() {
        return features;
    }

    public void setFeatures(List<String> features) {
        this.features = features;
    }

    public String getTargetAudience() {
        return targetAudience;
    }

    public void setTargetAudience(String targetAudience) {
        this.targetAudience = targetAudience;
    }
}
