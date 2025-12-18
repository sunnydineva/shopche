package com.shop.model.enums;

/**
 * Enum representing the possible states of an order.
 */
public enum OrderStatus {
    NEW,        // Order has been created but not yet processed
    PAID,       // Payment has been received
    SHIPPED,    // Order has been shipped
    DELIVERED,  // Order has been delivered
    CANCELED    // Order has been canceled
}