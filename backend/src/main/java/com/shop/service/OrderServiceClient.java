package com.shop.service;

import com.shop.client.OrderClient;
import com.shop.dto.order.OrderCreateDTO;
import com.shop.dto.order.OrderDTO;
import com.shop.dto.order.OrderStatusUpdateDTO;
import com.shop.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

/**
 * Service for managing orders through the order microservice
 */
@Service
public class OrderServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(OrderServiceClient.class);

    private final OrderClient orderClient;

    public OrderServiceClient(OrderClient orderClient) {
        this.orderClient = orderClient;
    }

    /**
     * Get all orders with pagination (admin)
     */
    public Page<OrderDTO> getAllOrders(Pageable pageable) {
        logger.info("Fetching all orders with pagination through order service");
        return orderClient.getAllOrders(pageable);
    }

    /**
     * Get orders by user ID with pagination
     */
    public Page<OrderDTO> getOrdersByUserId(Long userId, Pageable pageable) {
        logger.info("Fetching orders for user ID {} through order service", userId);
        return orderClient.getOrdersByUserId(userId, pageable);
    }

    /**
     * Get order by ID
     */
    public OrderDTO getOrderById(Long id) {
        logger.info("Fetching order with ID {} through order service", id);
        return unwrap(orderClient.getOrderById(id), "Order", id);
    }

    /**
     * Create a new order
     */
    public OrderDTO createOrder(OrderCreateDTO orderCreateDTO, Long userId) {
        logger.info("Creating order for user ID {} through order service", userId);
        return unwrap(orderClient.createOrder(orderCreateDTO, userId), "Order", userId);
    }

    /**
     * Update order status
     */
    public OrderDTO updateOrderStatus(Long id, OrderStatusUpdateDTO statusUpdateDTO) {
        logger.info("Updating order status for order ID {} through order service", id);
        return unwrap(orderClient.updateOrderStatus(id, statusUpdateDTO), "Order", id);
    }

    private <T> T unwrap(ResponseEntity<T> response, String resourceName, Long id) {
        if (response == null || response.getBody() == null) {
            throw new ResourceNotFoundException(resourceName, "id", id);
        }
        return response.getBody();
    }
}
