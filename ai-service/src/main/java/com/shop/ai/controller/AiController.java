package com.shop.ai.controller;

import com.shop.ai.dto.*;
import com.shop.ai.service.OpenAiService;
import com.shop.ai.service.RateLimitService;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Controller for AI-related endpoints
 */
@RestController
@RequestMapping("/api/ai")
public class AiController {

    private static final Logger logger = LoggerFactory.getLogger(AiController.class);

    private final OpenAiService openAiService;
    private final RateLimitService rateLimitService;

    public AiController(OpenAiService openAiService, RateLimitService rateLimitService) {
        this.openAiService = openAiService;
        this.rateLimitService = rateLimitService;
    }

    /**
     * Generate product description using AI
     */
    @PostMapping("/generate-description")
    public ResponseEntity<?> generateDescription(
            @Valid @RequestBody GenerateDescriptionRequest request,
            @RequestHeader(value = "X-Request-Id", required = false) String requestId,
            HttpServletRequest httpRequest) {

        // Generate UUID if X-Request-Id is missing
        if (requestId == null || requestId.trim().isEmpty()) {
            requestId = UUID.randomUUID().toString();
        }

        // Get client IP for rate limiting
        String clientIp = getClientIpAddress(httpRequest);

        logger.info("Received generate-description request for product: {} with requestId: {} from IP: {}", 
                request.getProductName(), requestId, clientIp);

        // Check rate limiting
        if (!rateLimitService.isRequestAllowed(clientIp, requestId)) {
            logger.warn("Rate limit exceeded for IP: {} on request: {}", clientIp, requestId);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Rate limit exceeded. Maximum " + rateLimitService.getRateLimit() + " requests per minute allowed.");
        }

        try {
            GenerateDescriptionResponse response = openAiService.generateDescription(request, requestId);

            logger.info("Successfully processed generate-description request: {} for product: {}, tokens used: {}", 
                    requestId, request.getProductName(), response.getTokensUsed());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Failed to generate description for request: {} and product: {}", 
                    requestId, request.getProductName(), e);

            // Return 503 Service Unavailable for service errors
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Unable to process AI request at this time: " + e.getMessage());
        }
    }

    /**
     * Generate social media post using AI
     */
    @PostMapping("/generate-social-post")
    public ResponseEntity<?> generateSocialPost(
            @Valid @RequestBody GenerateSocialPostRequest request,
            @RequestHeader(value = "X-Request-Id", required = false) String requestId,
            HttpServletRequest httpRequest) {

        // Generate UUID if X-Request-Id is missing
        if (requestId == null || requestId.trim().isEmpty()) {
            requestId = UUID.randomUUID().toString();
        }

        // Get client IP for rate limiting
        String clientIp = getClientIpAddress(httpRequest);

        logger.info("Received generate-social-post request for product: {} with requestId: {} from IP: {}", 
                request.getProductName(), requestId, clientIp);

        // Check rate limiting
        if (!rateLimitService.isRequestAllowed(clientIp, requestId)) {
            logger.warn("Rate limit exceeded for IP: {} on request: {}", clientIp, requestId);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Rate limit exceeded. Maximum " + rateLimitService.getRateLimit() + " requests per minute allowed.");
        }

        try {
            GenerateSocialPostResponse response = openAiService.generateSocialPost(request, requestId);

            logger.info("Successfully processed generate-social-post request: {} for product: {}, tokens used: {}", 
                    requestId, request.getProductName(), response.getTokensUsed());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Failed to generate social post for request: {} and product: {}", 
                    requestId, request.getProductName(), e);

            // Return 503 Service Unavailable for service errors
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Unable to process AI request at this time: " + e.getMessage());
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("AI Service is running");
    }

    /**
     * Get client IP address from request
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }
}
