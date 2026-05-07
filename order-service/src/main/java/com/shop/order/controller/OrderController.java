package com.shop.order.controller;

import com.shop.order.dto.OrderCreateDTO;
import com.shop.order.dto.OrderDTO;
import com.shop.order.dto.OrderStatusUpdateDTO;
import com.shop.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

@RestController
@RequestMapping
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/api/admin/orders")
    public ResponseEntity<Page<OrderDTO>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        Pageable pageable = PageRequest.of(page, size, buildSort(sort, direction));
        return ResponseEntity.ok(orderService.getAllOrders(pageable));
    }

    @GetMapping("/api/user/orders")
    public ResponseEntity<Page<OrderDTO>> getUserOrders(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        Pageable pageable = PageRequest.of(page, size, buildSort(sort, direction));
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId, pageable));
    }

    @GetMapping("/api/orders/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PostMapping("/api/user/orders")
    public ResponseEntity<OrderDTO> createOrder(
            @Valid @RequestBody OrderCreateDTO orderCreateDTO,
            @RequestParam Long userId,
            @RequestParam String userEmail) {
        return ResponseEntity.ok(orderService.createOrder(orderCreateDTO, userId, userEmail));
    }

    @PutMapping("/api/admin/orders/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateDTO statusUpdateDTO) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, statusUpdateDTO));
    }

    private Sort buildSort(String sort, String direction) {
        if (sort != null && sort.contains(",")) {
            String[] parts = Arrays.stream(sort.split(","))
                    .map(String::trim)
                    .toArray(String[]::new);
            if (parts.length == 2) {
                Sort.Direction parsedDirection = parts[1].equalsIgnoreCase("desc")
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;
                return Sort.by(parsedDirection, parts[0]);
            }
        }

        Sort.Direction sortDirection = direction != null && direction.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        return Sort.by(sortDirection, sort == null || sort.isBlank() ? "createdAt" : sort);
    }
}
