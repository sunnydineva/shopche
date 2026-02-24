package com.shop.client;

import com.shop.dto.ai.GenerateDescriptionRequest;
import com.shop.dto.ai.GenerateDescriptionResponse;
import com.shop.dto.ai.GenerateSocialPostRequest;
import com.shop.dto.ai.GenerateSocialPostResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

/**
 * Feign client for communicating with the AI service
 */
@FeignClient(name = "ai-service", url = "${ai-service.url}")
public interface AiClient {

    /**
     * Generate product description using AI
     */
    @PostMapping("/api/ai/generate-description")
    ResponseEntity<GenerateDescriptionResponse> generateDescription(
            @RequestBody GenerateDescriptionRequest request,
            @RequestHeader("X-Request-Id") String requestId);

    /**
     * Generate social media post using AI
     */
    @PostMapping("/api/ai/generate-social-post")
    ResponseEntity<GenerateSocialPostResponse> generateSocialPost(
            @RequestBody GenerateSocialPostRequest request,
            @RequestHeader("X-Request-Id") String requestId);
}