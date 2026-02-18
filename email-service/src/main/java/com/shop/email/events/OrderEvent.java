package com.shop.email.events;

import java.math.BigDecimal;

public class OrderEvent {

    private Long orderId;
    private Long userId;
    private String userEmail;
    private String status;
    private BigDecimal totalAmount;
    private String createdAt; // ISO string

    public OrderEvent() {
    }

    public OrderEvent(Long orderId, Long userId, String userEmail, String status, BigDecimal totalAmount, String createdAt) {
        this.orderId = orderId;
        this.userId = userId;
        this.userEmail = userEmail;
        this.status = status;
        this.totalAmount = totalAmount;
        this.createdAt = createdAt;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUserEmail()
    {
        return userEmail;
    }

    public void setUserEmail(String userEmail)
    {
        this.userEmail = userEmail;
    }

    @Override
    public String toString() {
        return "OrderEvent{" +
                "orderId=" + orderId +
                ", userId=" + userId +
                ", userEmail=" + userEmail +
                ", status='" + status + '\'' +
                ", totalAmount=" + totalAmount +
                ", createdAt='" + createdAt + '\'' +
                '}';
    }
}