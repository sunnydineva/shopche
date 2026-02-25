package com.shop.service;

import com.shop.client.AiClient;
import com.shop.dto.ai.GenerateDescriptionRequest;
import com.shop.dto.ai.GenerateDescriptionResponse;
import com.shop.dto.ai.GenerateSocialPostRequest;
import com.shop.dto.ai.GenerateSocialPostResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Service for managing AI operations through the AI microservice
 */
@Service
public class AiServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(AiServiceClient.class);

    private final AiClient aiClient;

    public AiServiceClient(AiClient aiClient) {
        this.aiClient = aiClient;
    }

    /**
     * Generate product description using AI
     */
    public GenerateDescriptionResponse generateDescription(GenerateDescriptionRequest request, String requestId) {
        if (requestId == null || requestId.trim().isEmpty()) {
            requestId = UUID.randomUUID().toString();
        }

        logger.info("Generating product description for product: {} with requestId: {}", 
                request.getProductName(), requestId);

        try {
            GenerateDescriptionResponse response = aiClient.generateDescription(request, requestId).getBody();
            logger.info("Successfully generated description for product: {} with requestId: {}", 
                    request.getProductName(), requestId);
            return response;
        } catch (Exception e) {
            logger.error("Error generating description for product: {} with requestId: {}", 
                    request.getProductName(), requestId, e);
            throw new RuntimeException("Failed to generate product description: " + e.getMessage(), e);
        }
    }

    /**
     * Generate social media post using AI
     */
    public GenerateSocialPostResponse generateSocialPost(GenerateSocialPostRequest request, String requestId) {
        if (requestId == null || requestId.trim().isEmpty()) {
            requestId = UUID.randomUUID().toString();
        }

        logger.info("Generating social post for product: {} with requestId: {}", 
                request.getProductName(), requestId);

        try {
            GenerateSocialPostResponse response = aiClient.generateSocialPost(request, requestId).getBody();

            logger.info("Successfully generated social post for product: {} with requestId: {}", 
                    request.getProductName(), requestId);
            return response;
        } catch (Exception e) {
            logger.error("Error generating social post for product: {} with requestId: {}", 
                    request.getProductName(), requestId, e);
            throw new RuntimeException("Failed to generate social post: " + e.getMessage(), e);
        }
    }
}
