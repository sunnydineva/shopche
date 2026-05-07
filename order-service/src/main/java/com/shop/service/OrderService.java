package com.shop.service;

import com.shop.mapper.OrderMapper;
import com.shop.mapper.OrderMapper.ProductSnapshot;
import com.shop.events.avro.OrderEvent;
import com.shop.order.dto.OrderCreateDTO;
import com.shop.order.dto.OrderDTO;
import com.shop.order.dto.OrderStatusUpdateDTO;
import com.shop.order.dto.ProductDTO;
import com.shop.order.exception.ResourceNotFoundException;
import com.shop.order.model.Order;
import com.shop.order.model.OrderItem;
import com.shop.order.model.enums.OrderStatus;
import com.shop.order.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final RestTemplate restTemplate;
    private final String productServiceUrl;
    private final KafkaTemplate<String, OrderEvent> orderEventKafkaTemplate;

    public OrderService(OrderRepository orderRepository,
                        OrderMapper orderMapper,
                        @Value("${product-service.url:http://product-service:8084}") String productServiceUrl,
                        @Qualifier("orderEventKafkaTemplate") KafkaTemplate<String, OrderEvent> orderEventKafkaTemplate) {
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.restTemplate = new RestTemplate();
        this.productServiceUrl = productServiceUrl;
        this.orderEventKafkaTemplate = orderEventKafkaTemplate;
    }

    @Transactional(readOnly = true)
    public Page<OrderDTO> getAllOrders(Pageable pageable) {
        logger.info("Fetching all orders with pagination");
        return orderRepository.findAll(pageable).map(orderMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public Page<OrderDTO> getOrdersByUserId(Long userId, Pageable pageable) {
        logger.info("Fetching orders for user ID: {}", userId);
        return orderRepository.findByUserId(userId, pageable).map(orderMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long id) {
        logger.info("Fetching order with ID: {}", id);
        return orderMapper.toDTO(findOrderById(id));
    }

    @Transactional
    public OrderDTO createOrder(OrderCreateDTO orderCreateDTO, Long userId, String userEmail) {
        logger.info("Creating new order for user ID: {}", userId);
        if (orderCreateDTO == null || orderCreateDTO.getItems() == null || orderCreateDTO.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        List<Long> productIds = orderCreateDTO.getItems().stream()
                .map(OrderCreateDTO.OrderItemCreateDTO::getProductId)
                .toList();

        List<ProductDTO> products = fetchProducts(productIds);
        validateStock(orderCreateDTO, products);

        Order order = orderMapper.createOrderFromDTO(orderCreateDTO, userId, userEmail, orderMapper.toSnapshots(products));
        reserveStock(orderCreateDTO, products);

        Order savedOrder = orderRepository.save(order);
        logger.info("Order created with ID: {}", savedOrder.getId());
        sendOrderCreatedEvent(savedOrder);
        return orderMapper.toDTO(savedOrder);
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long id, OrderStatusUpdateDTO statusUpdateDTO) {
        logger.info("Updating status for order ID: {} to {}", id, statusUpdateDTO.getStatus());

        Order order = findOrderById(id);

        if (statusUpdateDTO.getStatus() == OrderStatus.CANCELED) {
            if (!order.canBeCanceled()) {
                throw new IllegalStateException("Cannot cancel order in status: " + order.getStatus());
            }
            order.cancel();
            restoreStock(order.getOrderItems());
        } else {
            orderMapper.updateOrderStatus(order, statusUpdateDTO);
        }

        return orderMapper.toDTO(orderRepository.save(order));
    }

    private Order findOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
    }

    private List<ProductDTO> fetchProducts(List<Long> productIds) {
        List<ProductDTO> products = new ArrayList<>();
        for (Long productId : productIds) {
            products.add(fetchProduct(productId));
        }
        return products;
    }

    private ProductDTO fetchProduct(Long productId) {
        try {
            ResponseEntity<ProductDTO> response = restTemplate.getForEntity(
                    productServiceUrl + "/api/products/" + productId,
                    ProductDTO.class
            );
            ProductDTO product = response.getBody();
            if (product == null) {
                throw new ResourceNotFoundException("Product", "id", productId);
            }
            return product;
        } catch (RestClientException ex) {
            throw new ResourceNotFoundException("Product", "id", productId);
        }
    }

    private void validateStock(OrderCreateDTO orderCreateDTO, List<ProductDTO> products) {
        for (OrderCreateDTO.OrderItemCreateDTO item : orderCreateDTO.getItems()) {
            ProductDTO product = products.stream()
                    .filter(p -> Objects.equals(p.getId(), item.getProductId()))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", item.getProductId()));

            if (product.getStockQuantity() == null || product.getStockQuantity() < item.getQuantity()) {
                throw new IllegalStateException("Product " + product.getName() + " is out of stock. Available: "
                        + product.getStockQuantity() + ", Requested: " + item.getQuantity());
            }
        }
    }

    private void reserveStock(OrderCreateDTO orderCreateDTO, List<ProductDTO> products) {
        for (OrderCreateDTO.OrderItemCreateDTO item : orderCreateDTO.getItems()) {
            ProductDTO product = products.stream()
                    .filter(p -> Objects.equals(p.getId(), item.getProductId()))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", item.getProductId()));

            updateProductStock(product, product.getStockQuantity() - item.getQuantity());
        }
    }

    private void restoreStock(List<OrderItem> orderItems) {
        if (orderItems == null || orderItems.isEmpty()) {
            return;
        }

        for (OrderItem item : orderItems) {
            ProductDTO product = fetchProduct(item.getProductId());
            Integer currentStock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
            updateProductStock(product, currentStock + item.getQuantity());
        }
    }

    private void updateProductStock(ProductDTO product, int stockQuantity) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("name", product.getName());
        payload.put("description", product.getDescription());
        payload.put("price", product.getPrice());
        payload.put("currency", product.getCurrency());
        payload.put("stockQuantity", stockQuantity);
        payload.put("imageUrl", null);
        payload.put("categoryId", product.getCategoryId());
        payload.put("isActive", product.getIsActive());

        restTemplate.exchange(
                productServiceUrl + "/api/products/" + product.getId(),
                HttpMethod.PUT,
                new HttpEntity<>(payload),
                Void.class
        );
    }

    private void sendOrderCreatedEvent(Order order) {
        String createdAtIso = order.getCreatedAt() != null
                ? order.getCreatedAt().atOffset(ZoneOffset.UTC).toString()
                : OffsetDateTime.now(ZoneOffset.UTC).toString();

        OrderEvent event = OrderEvent.newBuilder()
                .setOrderId(order.getId())
                .setUserId(order.getUserId())
                .setUserEmail(order.getUserEmail())
                .setStatus(com.shop.events.avro.OrderStatus.valueOf(order.getStatus().name()))
                .setTotalAmount(order.getTotalAmount().doubleValue())
                .setCreatedAt(createdAtIso)
                .build();

        try {
            orderEventKafkaTemplate.send("order-events-avro", order.getId().toString(), event);
            logger.info("Kafka order event sent for order {}", order.getId());
        } catch (Exception ex) {
            logger.warn("Failed to send Kafka order event for order {}: {}", order.getId(), ex.getMessage());
        }
    }
}
