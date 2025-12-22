package com.shop.mapper;

import com.shop.dto.order.OrderCreateDTO;
import com.shop.dto.order.OrderDTO;
import com.shop.dto.order.OrderStatusUpdateDTO;
import com.shop.model.Order;
import com.shop.model.OrderItem;
import com.shop.model.Product;
import com.shop.model.User;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting between Order entity and DTOs
 */
@Component
public class OrderMapper {

    /**
     * Convert Order entity to OrderDTO
     */
    public OrderDTO toDTO(Order order) {
        if (order == null) {
            return null;
        }

        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        if (order.getUser() != null) {
            dto.setUserId(order.getUser().getId());
            dto.setUserEmail(order.getUser().getEmail());
        }

        if (order.getOrderItems() != null) {
            List<OrderDTO.OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                    .map(this::toOrderItemDTO)
                    .collect(Collectors.toList());
            dto.setOrderItems(itemDTOs);
        }

        return dto;
    }

    /**
     * Convert OrderItem entity to OrderItemDTO
     */
    private OrderDTO.OrderItemDTO toOrderItemDTO(OrderItem orderItem) {
        if (orderItem == null) {
            return null;
        }

        OrderDTO.OrderItemDTO dto = new OrderDTO.OrderItemDTO();
        dto.setId(orderItem.getId());
        dto.setQuantity(orderItem.getQuantity());
        dto.setUnitPrice(orderItem.getUnitPrice());
        dto.setSubtotal(orderItem.getSubtotal());

        if (orderItem.getProduct() != null) {
            dto.setProductId(orderItem.getProduct().getId());
            dto.setProductName(orderItem.getProduct().getName());
        }

        return dto;
    }

    /**
     * Convert list of Order entities to list of OrderDTOs
     */
    public List<OrderDTO> toDTOList(List<Order> orders) {
        return orders.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Create Order entity from OrderCreateDTO and User
     */
    public Order createOrderFromDTO(OrderCreateDTO dto, User user, List<Product> products) {
        if (dto == null || user == null || products == null || products.isEmpty()) {
            return null;
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderItems(new ArrayList<>());
        order.setCreatedAt(LocalDateTime.now());

        // Create order items
        for (OrderCreateDTO.OrderItemCreateDTO itemDTO : dto.getItems()) {
            Product product = findProductById(products, itemDTO.getProductId());
            if (product != null) {
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(product);
                orderItem.setQuantity(itemDTO.getQuantity());

                // Safely set unit price and calculate subtotal
                BigDecimal price = product.getPrice();
                orderItem.setUnitPrice(price);
                if (price != null && itemDTO.getQuantity() != null) {
                    orderItem.setSubtotal(price.multiply(BigDecimal.valueOf(itemDTO.getQuantity())));
                } else {
                    orderItem.setSubtotal(BigDecimal.ZERO);
                }

                order.getOrderItems().add(orderItem);
            }
        }

        // Calculate total amount
        order.recalculateTotalAmount();

        return order;
    }

    /**
     * Update Order status from OrderStatusUpdateDTO
     */
    public void updateOrderStatus(Order order, OrderStatusUpdateDTO dto) {
        if (order == null || dto == null) {
            return;
        }

        order.setStatus(dto.getStatus());
    }

    /**
     * Helper method to find a product by ID in a list
     */
    private Product findProductById(List<Product> products, Long productId) {
        return products.stream()
                .filter(p -> p.getId().equals(productId))
                .findFirst()
                .orElse(null);
    }
}
