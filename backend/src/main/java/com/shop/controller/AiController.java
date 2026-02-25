package com.shop.controller;

import com.shop.dto.ai.GenerateDescriptionRequest;
import com.shop.dto.ai.GenerateDescriptionResponse;
import com.shop.dto.ai.GenerateSocialPostRequest;
import com.shop.dto.ai.GenerateSocialPostResponse;
import com.shop.service.AiServiceClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import org.springframework.web.client.HttpClientErrorException;

import java.util.UUID;

/**
 * Controller for AI-related endpoints
 */
@RestController
@RequestMapping("/api/ai")
public class AiController {

    private static final Logger logger = LoggerFactory.getLogger(AiController.class);
    private final AiServiceClient aiServiceClient;

    public AiController(AiServiceClient aiServiceClient) {
        this.aiServiceClient = aiServiceClient;
    }

    /**
     * Generate product description using AI
     */
    @PostMapping("/generate-description")
    public ResponseEntity<?> generateDescription(
            @Valid @RequestBody GenerateDescriptionRequest request,
            @RequestHeader(value = "X-Request-Id", required = false) String requestId) {

        // Generate UUID if X-Request-Id is missing
        if (requestId == null || requestId.trim().isEmpty()) {
            requestId = UUID.randomUUID().toString();
        }

        logger.info("Received request to generate description for product: {} with requestId: {}", 
                request.getProductName(), requestId);

        try {
            GenerateDescriptionResponse response = aiServiceClient.generateDescription(request, requestId);
            logger.info("Successfully processed description generation request with requestId: {}", requestId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Failed to generate description with requestId: {}", requestId, e);

            // Return 502 Bad Gateway for service communication errors
            if (e.getCause() instanceof java.net.ConnectException || 
                e.getCause() instanceof java.net.SocketTimeoutException) {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                        .body("AI service is temporarily unavailable");
            }

            // Return 503 Service Unavailable for other service errors
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Unable to process AI request at this time");
        }
    }

    /**
     * Generate social media post using AI
     */
    @PostMapping("/generate-social-post")
    public ResponseEntity<?> generateSocialPost(
            @Valid @RequestBody GenerateSocialPostRequest request,
            @RequestHeader(value = "X-Request-Id", required = false) String requestId) {

        // Generate UUID if X-Request-Id is missing
        if (requestId == null || requestId.trim().isEmpty()) {
            requestId = UUID.randomUUID().toString();
        }

        logger.info("Received request to generate social post for product: {} with requestId: {}", 
                request.getProductName(), requestId);

        try {
            GenerateSocialPostResponse response = aiServiceClient.generateSocialPost(request, requestId);
            logger.info("Successfully processed social post generation request with requestId: {}", requestId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Failed to generate social post with requestId: {}", requestId, e);

            // Return 502 Bad Gateway for service communication errors
            if (e.getCause() instanceof java.net.ConnectException || 
                e.getCause() instanceof java.net.SocketTimeoutException) {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                        .body("AI service is temporarily unavailable");
            }

            // Return 503 Service Unavailable for other service errors
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Unable to process AI request at this time");
        }
    }
}
