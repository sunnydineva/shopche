package com.shop.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

/**
 * Data Transfer Object for Order creation requests
 */
public class OrderCreateDTO {
    
    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemCreateDTO> items = new ArrayList<>();

    // Constructors
    public OrderCreateDTO() {
    }

    // Getters and Setters
    public List<OrderItemCreateDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemCreateDTO> items) {
        this.items = items;
    }

    /**
     * Nested DTO for OrderItem in Order creation requests
     */
    public static class OrderItemCreateDTO {
        
        @NotNull(message = "Product ID is required")
        private Long productId;
        
        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;

        // Constructors
        public OrderItemCreateDTO() {
        }

        public OrderItemCreateDTO(Long productId, Integer quantity) {
            this.productId = productId;
            this.quantity = quantity;
        }

        // Getters and Setters
        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}