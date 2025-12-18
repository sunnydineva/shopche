package com.shop.dto.order;

import com.shop.model.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;

/**
 * Data Transfer Object for Order status update requests
 */
public class OrderStatusUpdateDTO {

    @NotNull(message = "Order status is required")
    private OrderStatus status;

    // Constructors
    public OrderStatusUpdateDTO() {
    }

    public OrderStatusUpdateDTO(OrderStatus status) {
        this.status = status;
    }

    // Getters and Setters
    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}
