package com.shop.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shop.ai.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

/**
 * Service for integrating with OpenAI API
 */
@Service
public class OpenAiService {

    private static final Logger logger = LoggerFactory.getLogger(OpenAiService.class);

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url}")
    private String apiUrl;

    @Value("${openai.model:gpt-3.5-turbo}")
    private String model;

    @Value("${openai.max-tokens:500}")
    private int maxTokens;

    @Value("${openai.temperature:0.7}")
    private double temperature;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public OpenAiService() {
        this.webClient = WebClient.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(1024 * 1024))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Generate product description using OpenAI
     */
    public GenerateDescriptionResponse generateDescription(GenerateDescriptionRequest request, String requestId) {
        logger.info("Generating description for product: {} with requestId: {}", request.getProductName(), requestId);

        String prompt = buildDescriptionPrompt(request);
        String response = callOpenAi(prompt, requestId);

        try {
            // Parse the structured response from OpenAI
            JsonNode responseJson = objectMapper.readTree(response);

            String description = responseJson.path("description").asText();
            List<String> bullets = Arrays.asList(responseJson.path("bullets").asText().split("\n"));
            String seoTitle = responseJson.path("seoTitle").asText();
            List<String> seoKeywords = Arrays.asList(responseJson.path("seoKeywords").asText().split(","));

            // Estimate token usage (rough estimation)
            int estimatedTokens = (prompt.length() + response.length()) / 4;

            logger.info("Successfully generated description for product: {} with requestId: {}, estimated tokens: {}", 
                    request.getProductName(), requestId, estimatedTokens);

            return new GenerateDescriptionResponse(requestId, description, bullets, seoTitle, seoKeywords, estimatedTokens);

        } catch (Exception e) {
            logger.error("Error parsing OpenAI response for requestId: {}", requestId, e);

            // Fallback: treat entire response as description
            int estimatedTokens = (prompt.length() + response.length()) / 4;
            return new GenerateDescriptionResponse(requestId, response, 
                    Arrays.asList("Качествен продукт", "Отлична цена", "Бърза доставка"), 
                    request.getProductName(), 
                    Arrays.asList(request.getProductName(), request.getCategory()), 
                    estimatedTokens);
        }
    }

    /**
     * Generate social media post using OpenAI
     */
    public GenerateSocialPostResponse generateSocialPost(GenerateSocialPostRequest request, String requestId) {
        logger.info("Generating social post for product: {} with requestId: {}", request.getProductName(), requestId);

        String prompt = buildSocialPostPrompt(request);
        String response = callOpenAi(prompt, requestId);

        try {
            // Parse the structured response from OpenAI
            JsonNode responseJson = objectMapper.readTree(response);

            String caption = responseJson.path("caption").asText();
            List<String> hashtags = Arrays.asList(responseJson.path("hashtags").asText().split(","));
            String fullText = caption + "\n\n" + String.join(" ", hashtags);

            // Estimate token usage (rough estimation)
            int estimatedTokens = (prompt.length() + response.length()) / 4;

            logger.info("Successfully generated social post for product: {} with requestId: {}, estimated tokens: {}", 
                    request.getProductName(), requestId, estimatedTokens);

            return new GenerateSocialPostResponse(requestId, caption, hashtags, fullText, estimatedTokens);

        } catch (Exception e) {
            logger.error("Error parsing OpenAI response for requestId: {}", requestId, e);

            // Fallback: treat entire response as caption
            int estimatedTokens = (prompt.length() + response.length()) / 4;
            List<String> defaultHashtags = Arrays.asList("#продукт", "#качество", "#онлайнмагазин");
            String fullText = response + "\n\n" + String.join(" ", defaultHashtags);

            return new GenerateSocialPostResponse(requestId, response, defaultHashtags, fullText, estimatedTokens);
        }
    }

    private String buildDescriptionPrompt(GenerateDescriptionRequest request) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Генерирай структурирано описание на продукт на български език в JSON формат с полета: description, bullets, seoTitle, seoKeywords.\n\n");
        prompt.append("Продукт: ").append(request.getProductName()).append("\n");

        if (request.getCategory() != null) {
            prompt.append("Категория: ").append(request.getCategory()).append("\n");
        }

        if (request.getFeatures() != null && !request.getFeatures().isEmpty()) {
            prompt.append("Характеристики: ").append(String.join(", ", request.getFeatures())).append("\n");
        }

        if (request.getTargetAudience() != null) {
            prompt.append("Целева аудитория: ").append(request.getTargetAudience()).append("\n");
        }

        prompt.append("\nОтговори в JSON формат с полета description (параграф), bullets (списък с точки), seoTitle (SEO заглавие), seoKeywords (ключови думи разделени със запетая).");

        return prompt.toString();
    }

    private String buildSocialPostPrompt(GenerateSocialPostRequest request) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Генерирай социален медия пост на български език в JSON формат с полета: caption, hashtags.\n\n");
        prompt.append("Продукт: ").append(request.getProductName()).append("\n");

        if (request.getProductDescription() != null) {
            prompt.append("Описание: ").append(request.getProductDescription()).append("\n");
        }

        prompt.append("Платформа: ").append(request.getPlatform()).append("\n");

        if (request.getTone() != null) {
            prompt.append("Тон: ").append(request.getTone()).append("\n");
        }

        prompt.append("\nОтговори в JSON формат с полета caption (текст на поста) и hashtags (хаштагове разделени със запетая).");

        return prompt.toString();
    }

    private String callOpenAi(String prompt, String requestId) {
        try {
            // Create message map
            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);

            // Create messages list
            List<Map<String, Object>> messages = new ArrayList<>();
            messages.add(message);

            // Create request body map
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("messages", messages);
            requestBody.put("max_tokens", maxTokens);
            requestBody.put("temperature", temperature);

            logger.debug("Calling OpenAI API for requestId: {} with prompt length: {}", requestId, prompt.length());

            String response = webClient.post()
                    .uri(apiUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(30))
                    .block();

            // Extract content from OpenAI response
            JsonNode responseJson = objectMapper.readTree(response);
            String content = responseJson.path("choices").get(0).path("message").path("content").asText();

            logger.debug("OpenAI API call successful for requestId: {}, response length: {}", requestId, content.length());
            return content;

        } catch (WebClientResponseException e) {
            logger.error("OpenAI API error for requestId: {}, status: {}, body: {}", requestId, e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("OpenAI API call failed: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Error calling OpenAI API for requestId: {}", requestId, e);
            throw new RuntimeException("OpenAI API call failed: " + e.getMessage(), e);
        }
    }
}
