package com.shop.repository;

import com.shop.model.Order;
import com.shop.model.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Find orders by user id
    List<Order> findByUserId(Long userId);

    // Find orders by user id with pagination
    Page<Order> findByUserId(Long userId, Pageable pageable);

    // Find orders by status
    List<Order> findByStatus(OrderStatus status);

    // Find orders by status with pagination
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    // Find orders by user id and status
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);

    // Find orders by user id and status with pagination
    Page<Order> findByUserIdAndStatus(Long userId, OrderStatus status, Pageable pageable);

    // Find orders created between dates
    List<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Find orders created between dates with pagination
    Page<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
}
