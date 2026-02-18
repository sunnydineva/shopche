package com.shop.service;

import com.shop.dto.order.OrderCreateDTO;
import com.shop.dto.order.OrderDTO;
import com.shop.dto.order.OrderStatusUpdateDTO;
import com.shop.events.OrderEvent;
import com.shop.exception.ResourceNotFoundException;
import com.shop.mapper.OrderMapper;
import com.shop.model.Order;
import com.shop.model.Product;
import com.shop.model.User;
import com.shop.model.enums.OrderStatus;
import com.shop.repository.OrderRepository;
import com.shop.repository.ProductRepository;
import com.shop.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing orders
 */
@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderMapper orderMapper;
    private final KafkaTemplate<String, OrderEvent> orderEventKafkaTemplate;

    public OrderService(OrderRepository orderRepository,
                       UserRepository userRepository,
                       ProductRepository productRepository,
                       OrderMapper orderMapper, KafkaTemplate<String, OrderEvent> orderEventKafkaTemplate) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderMapper = orderMapper;
        this.orderEventKafkaTemplate = orderEventKafkaTemplate;
    }

    /**
     * Get all orders with pagination (admin)
     */
    @Transactional(readOnly = true)
    public Page<OrderDTO> getAllOrders(Pageable pageable) {
        logger.info("Fetching all orders with pagination");
        Page<Order> orders = orderRepository.findAll(pageable);
        return orders.map(orderMapper::toDTO);
    }

    /**
     * Get orders by user ID with pagination
     */
    @Transactional(readOnly = true)
    public Page<OrderDTO> getOrdersByUserId(Long userId, Pageable pageable) {
        logger.info("Fetching orders for user ID: {}", userId);

        // Check if user exists
        if (!userRepository.existsById(userId)) {
            logger.error("User not found with ID: {}", userId);
            throw new ResourceNotFoundException("User", "id", userId);
        }

        Page<Order> orders = orderRepository.findByUserId(userId, pageable);
        return orders.map(orderMapper::toDTO);
    }

    /**
     * Get order by ID
     */
    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long id) {
        logger.info("Fetching order with ID: {}", id);
        Order order = findOrderById(id);
        return orderMapper.toDTO(order);
    }

    /**
     * Create a new order
     */
    @Transactional
    public OrderDTO createOrder(OrderCreateDTO orderCreateDTO, Long userId) {
        logger.info("Creating new order for user ID: {}", userId);

        // Check if user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found with ID: {}", userId);
                    return new ResourceNotFoundException("User", "id", userId);
                });

        // Get all product IDs from the order
        List<Long> productIds = orderCreateDTO.getItems().stream()
                .map(OrderCreateDTO.OrderItemCreateDTO::getProductId)
                .collect(Collectors.toList());

        // Fetch all products at once
        List<Product> products = productRepository.findAllById(productIds);

        // Check if all products exist
        if (products.size() != productIds.size()) {
            logger.error("Some products were not found");
            List<Long> foundProductIds = products.stream()
                    .map(Product::getId)
                    .collect(Collectors.toList());

            List<Long> missingProductIds = new ArrayList<>(productIds);
            missingProductIds.removeAll(foundProductIds);

            throw new ResourceNotFoundException("Products not found with IDs: " + missingProductIds);
        }

        // Check if all products are in stock
        for (OrderCreateDTO.OrderItemCreateDTO item : orderCreateDTO.getItems()) {
            Product product = products.stream()
                    .filter(p -> p.getId().equals(item.getProductId()))
                    .findFirst()
                    .orElseThrow();

            if (product.getStockQuantity() < item.getQuantity()) {
                logger.error("Product {} is out of stock. Available: {}, Requested: {}", 
                        product.getId(), product.getStockQuantity(), item.getQuantity());
                throw new IllegalStateException("Product " + product.getName() + " is out of stock. Available: " 
                        + product.getStockQuantity() + ", Requested: " + item.getQuantity());
            }
        }

        // Create order
        Order order = orderMapper.createOrderFromDTO(orderCreateDTO, user, products);

        // Update product stock
        for (OrderCreateDTO.OrderItemCreateDTO item : orderCreateDTO.getItems()) {
            Product product = products.stream()
                    .filter(p -> p.getId().equals(item.getProductId()))
                    .findFirst()
                    .orElseThrow();

            product.decreaseStock(item.getQuantity());
            productRepository.save(product);
        }

        Order savedOrder = orderRepository.save(order);
        logger.info("Order created with ID: {}", savedOrder.getId());

        String createdAtIso = savedOrder.getCreatedAt() != null
                ? savedOrder.getCreatedAt().atOffset(ZoneOffset.UTC).toString()
                : java.time.OffsetDateTime.now(ZoneOffset.UTC).toString();

        OrderEvent event = new OrderEvent(
                savedOrder.getId(),
                savedOrder.getUser().getId(),
                savedOrder.getUser().getEmail(),
                savedOrder.getStatus().name(),
                savedOrder.getTotalAmount(),
                createdAtIso);

      //  orderEventKafkaTemplate.send("order-events", order.getId().toString(), event);

        try {
            orderEventKafkaTemplate.send("order-events", savedOrder.getId().toString(), event);
            logger.info("Kafka event sent for order {}", savedOrder.getId());
        } catch (Exception e) {

            logger.warn("Failed to send Kafka event for order {}: {}", savedOrder.getId(), e.getMessage());
        }

        return orderMapper.toDTO(savedOrder);
    }

    /**
     * Update order status
     */
    @Transactional
    public OrderDTO updateOrderStatus(Long id, OrderStatusUpdateDTO statusUpdateDTO) {
        logger.info("Updating status for order ID: {} to {}", id, statusUpdateDTO.getStatus());

        Order order = findOrderById(id);

        // Handle special case for cancellation
        if (statusUpdateDTO.getStatus() == OrderStatus.CANCELED) {
            if (!order.canBeCanceled()) {
                logger.error("Cannot cancel order in status: {}", order.getStatus());
                throw new IllegalStateException("Cannot cancel order in status: " + order.getStatus());
            }

            order.cancel(); // This will also return items to stock
        } else {
            orderMapper.updateOrderStatus(order, statusUpdateDTO);
        }

        Order updatedOrder = orderRepository.save(order);
        logger.info("Order status updated: {}", updatedOrder.getId());

        return orderMapper.toDTO(updatedOrder);
    }

    /**
     * Helper method to find order by ID
     */
    private Order findOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Order not found with ID: {}", id);
                    return new ResourceNotFoundException("Order", "id", id);
                });
    }
}
