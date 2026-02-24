package com.shop.dto.ai;

/**
 * Response DTO for AI social post generation
 */
public class GenerateSocialPostResponse {
    private String socialPost;

    // Default constructor
    public GenerateSocialPostResponse() {}

    // Constructor
    public GenerateSocialPostResponse(String socialPost) {
        this.socialPost = socialPost;
    }

    // Getters and setters
    public String getSocialPost() {
        return socialPost;
    }

    public void setSocialPost(String socialPost) {
        this.socialPost = socialPost;
    }
}