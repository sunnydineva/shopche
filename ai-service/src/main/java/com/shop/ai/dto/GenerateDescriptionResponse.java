package com.shop.ai.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for AI product description generation
 */
public class GenerateDescriptionResponse {
    
    private String requestId;
    private String description;
    private List<String> bullets;
    private String seoTitle;
    private List<String> seoKeywords;
    private Integer tokensUsed;
    private LocalDateTime timestamp;

    // Default constructor
    public GenerateDescriptionResponse() {}

    // Constructor
    public GenerateDescriptionResponse(String requestId, String description, List<String> bullets, 
                                     String seoTitle, List<String> seoKeywords, Integer tokensUsed) {
        this.requestId = requestId;
        this.description = description;
        this.bullets = bullets;
        this.seoTitle = seoTitle;
        this.seoKeywords = seoKeywords;
        this.tokensUsed = tokensUsed;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and setters
    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getBullets() {
        return bullets;
    }

    public void setBullets(List<String> bullets) {
        this.bullets = bullets;
    }

    public String getSeoTitle() {
        return seoTitle;
    }

    public void setSeoTitle(String seoTitle) {
        this.seoTitle = seoTitle;
    }

    public List<String> getSeoKeywords() {
        return seoKeywords;
    }

    public void setSeoKeywords(List<String> seoKeywords) {
        this.seoKeywords = seoKeywords;
    }

    public Integer getTokensUsed() {
        return tokensUsed;
    }

    public void setTokensUsed(Integer tokensUsed) {
        this.tokensUsed = tokensUsed;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}