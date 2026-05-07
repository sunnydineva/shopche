package com.shop.mapper;

import com.shop.order.dto.OrderCreateDTO;
import com.shop.order.dto.OrderDTO;
import com.shop.order.dto.OrderStatusUpdateDTO;
import com.shop.order.dto.ProductDTO;
import com.shop.order.model.Order;
import com.shop.order.model.OrderItem;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public OrderDTO toDTO(Order order) {
        if (order == null) {
            return null;
        }

        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUserId());
        dto.setUserEmail(order.getUserEmail());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        if (order.getOrderItems() != null) {
            List<OrderDTO.OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                    .map(this::toOrderItemDTO)
                    .collect(Collectors.toList());
            dto.setOrderItems(itemDTOs);
        }

        return dto;
    }

    private OrderDTO.OrderItemDTO toOrderItemDTO(OrderItem orderItem) {
        if (orderItem == null) {
            return null;
        }

        OrderDTO.OrderItemDTO dto = new OrderDTO.OrderItemDTO();
        dto.setId(orderItem.getId());
        dto.setProductId(orderItem.getProductId());
        dto.setProductName(orderItem.getProductName());
        dto.setQuantity(orderItem.getQuantity());
        dto.setUnitPrice(orderItem.getUnitPrice());
        dto.setCurrency(orderItem.getCurrency());
        dto.setSubtotal(orderItem.getSubtotal());
        return dto;
    }

    public List<OrderDTO> toDTOList(List<Order> orders) {
        return orders.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Order createOrderFromDTO(OrderCreateDTO dto, Long userId, String userEmail, List<ProductSnapshot> products) {
        if (dto == null || userId == null || products == null || products.isEmpty()) {
            return null;
        }

        Order order = new Order(userId, userEmail);
        order.setOrderItems(new ArrayList<>());
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        for (OrderCreateDTO.OrderItemCreateDTO itemDTO : dto.getItems()) {
            ProductSnapshot product = findProductById(products, itemDTO.getProductId());
            if (product != null) {
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProductId(product.productId());
                orderItem.setProductName(product.productName());
                orderItem.setQuantity(itemDTO.getQuantity());
                orderItem.setUnitPrice(product.price());
                orderItem.setCurrency(product.currency());
                orderItem.setSubtotal(orderItem.calculateSubtotal());
                order.getOrderItems().add(orderItem);
            }
        }

        order.recalculateTotalAmount();
        return order;
    }

    public void updateOrderStatus(Order order, OrderStatusUpdateDTO dto) {
        if (order == null || dto == null) {
            return;
        }
        order.setStatus(dto.getStatus());
    }

    public ProductSnapshot toSnapshot(ProductDTO product) {
        if (product == null) {
            return null;
        }
        return new ProductSnapshot(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getCurrency() != null ? product.getCurrency() : "UNKNOWN"
        );
    }

    public List<ProductSnapshot> toSnapshots(List<ProductDTO> products) {
        return products.stream()
                .map(this::toSnapshot)
                .collect(Collectors.toList());
    }

    private ProductSnapshot findProductById(List<ProductSnapshot> products, Long productId) {
        return products.stream()
                .filter(p -> p.productId().equals(productId))
                .findFirst()
                .orElse(null);
    }

    public record ProductSnapshot(Long productId, String productName, BigDecimal price, String currency) {
    }
}
