package com.shop.ai.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Service for handling rate limiting using in-memory cache
 */
@Service
public class RateLimitService {

    private static final Logger logger = LoggerFactory.getLogger(RateLimitService.class);

    @Value("${rate-limit.requests-per-minute:10}")
    private int requestsPerMinute;

    @Value("${rate-limit.enabled:true}")
    private boolean rateLimitEnabled;

    private final Cache<String, AtomicInteger> requestCounts;

    public RateLimitService() {
        this.requestCounts = Caffeine.newBuilder()
                .maximumSize(10000)
                .expireAfterWrite(Duration.ofMinutes(1))
                .build();
    }

    /**
     * Check if the request is allowed based on rate limiting
     * @param clientId The client identifier (IP address or user ID)
     * @param requestId The request ID for logging
     * @return true if request is allowed, false if rate limit exceeded
     */
    public boolean isRequestAllowed(String clientId, String requestId) {
        if (!rateLimitEnabled) {
            logger.debug("Rate limiting is disabled, allowing request {} for client {}", requestId, clientId);
            return true;
        }

        AtomicInteger count = requestCounts.get(clientId, k -> new AtomicInteger(0));
        int currentCount = count.incrementAndGet();

        logger.debug("Request {} for client {}: current count = {}, limit = {}", 
                requestId, clientId, currentCount, requestsPerMinute);

        if (currentCount > requestsPerMinute) {
            logger.warn("Rate limit exceeded for client {} on request {}: {} requests in last minute (limit: {})", 
                    clientId, requestId, currentCount, requestsPerMinute);
            return false;
        }

        logger.debug("Request {} allowed for client {}", requestId, clientId);
        return true;
    }

    /**
     * Get current request count for a client
     * @param clientId The client identifier
     * @return current request count
     */
    public int getCurrentRequestCount(String clientId) {
        AtomicInteger count = requestCounts.getIfPresent(clientId);
        return count != null ? count.get() : 0;
    }

    /**
     * Get the configured rate limit
     * @return requests per minute limit
     */
    public int getRateLimit() {
        return requestsPerMinute;
    }
}