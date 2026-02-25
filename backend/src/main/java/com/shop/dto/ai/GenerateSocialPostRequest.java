package com.shop.dto.ai;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

/**
 * Request DTO for AI social post generation
 */
public class GenerateSocialPostRequest {
    @NotBlank(message = "Product name is required")
    private String productName;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    @NotBlank(message = "Currency is required")
    private String currency;
    private String imageUrl;
    private List<String> materials;
    private List<String> colors;
    private String currentDescription;

    // Default constructor
    public GenerateSocialPostRequest() {}

    // Constructor
    public GenerateSocialPostRequest(String name, Long categoryId, BigDecimal price, String currency) {
        this.productName = name;
        this.categoryId = categoryId;
        this.price = price;
        this.currency = currency;
    }

    // Getters and setters
    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<String> getMaterials() {
        return materials;
    }

    public void setMaterials(List<String> materials) {
        this.materials = materials;
    }

    public List<String> getColors() {
        return colors;
    }

    public void setColors(List<String> colors) {
        this.colors = colors;
    }

    public String getCurrentDescription() {
        return currentDescription;
    }

    public void setCurrentDescription(String currentDescription) {
        this.currentDescription = currentDescription;
    }
}
