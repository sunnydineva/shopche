package com.shop.client;

import com.shop.dto.order.OrderCreateDTO;
import com.shop.dto.order.OrderDTO;
import com.shop.dto.order.OrderStatusUpdateDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Feign client for communicating with the order service
 */
@FeignClient(name = "order-service", url = "${order-service.url}")
public interface OrderClient
{
    /**
     * Get all orders with pagination
     */
    @GetMapping("/api/admin/orders")
    Page<OrderDTO> getAllOrders(Pageable pageable);

    /**
     * Get orders by user ID with pagination
     */
    @GetMapping("/api/user/orders")
    Page<OrderDTO> getOrdersByUserId(@RequestParam("userId") Long userId, Pageable pageable);

    /**
     * Get order by ID
     */
    @GetMapping("/api/orders/{id}")
    ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id);

    /**
     * Create a new order
     */
    @PostMapping("/api/user/orders")
    ResponseEntity<OrderDTO> createOrder(@RequestBody OrderCreateDTO orderCreateDTO, @RequestParam("userId") Long userId);


    /**
     * Update order status
     */
    @PutMapping("/api/admin/orders/{id}/status")
    ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long id, @RequestBody OrderStatusUpdateDTO statusUpdateDTO);
}
