package com.shop.ai.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for AI social post generation
 */
public class GenerateSocialPostResponse {
    
    private String requestId;
    private String caption;
    private List<String> hashtags;
    private String fullText;
    private Integer tokensUsed;
    private LocalDateTime timestamp;

    // Default constructor
    public GenerateSocialPostResponse() {}

    // Constructor
    public GenerateSocialPostResponse(String requestId, String caption, List<String> hashtags, 
                                    String fullText, Integer tokensUsed) {
        this.requestId = requestId;
        this.caption = caption;
        this.hashtags = hashtags;
        this.fullText = fullText;
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

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public List<String> getHashtags() {
        return hashtags;
    }

    public void setHashtags(List<String> hashtags) {
        this.hashtags = hashtags;
    }

    public String getFullText() {
        return fullText;
    }

    public void setFullText(String fullText) {
        this.fullText = fullText;
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