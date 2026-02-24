package com.shop.ai.dto;

import javax.validation.constraints.NotBlank;

/**
 * Request DTO for AI social post generation
 */
public class GenerateSocialPostRequest {

    @NotBlank(message = "Product name is required")
    private String productName;

    private String productDescription;

    @NotBlank(message = "Platform is required")
    private String platform; // instagram, facebook

    private String tone; // casual, professional, exciting

    // Default constructor
    public GenerateSocialPostRequest() {}

    // Constructor
    public GenerateSocialPostRequest(String productName, String productDescription, String platform, String tone) {
        this.productName = productName;
        this.productDescription = productDescription;
        this.platform = platform;
        this.tone = tone;
    }

    // Getters and setters
    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getTone() {
        return tone;
    }

    public void setTone(String tone) {
        this.tone = tone;
    }
}
