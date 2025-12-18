package com.shop.repository;

import com.shop.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    // Find order items by order id
    List<OrderItem> findByOrderId(Long orderId);
    
    // Find order items by product id
    List<OrderItem> findByProductId(Long productId);
    
    // Find order items by order id and product id
    List<OrderItem> findByOrderIdAndProductId(Long orderId, Long productId);
    
    // Count order items by product id
    long countByProductId(Long productId);
    
    // Sum quantity of order items by product id
    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.product.id = :productId")
    Integer sumQuantityByProductId(@Param("productId") Long productId);
}