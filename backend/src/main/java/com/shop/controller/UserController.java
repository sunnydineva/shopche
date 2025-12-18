package com.shop.controller;

import com.shop.dto.order.OrderCreateDTO;
import com.shop.dto.order.OrderDTO;
import com.shop.dto.user.UserDTO;
import com.shop.dto.user.UserUpdateDTO;
import com.shop.service.OrderService;
import com.shop.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for authenticated user endpoints
 */
@RestController
@RequestMapping("/api/user")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;
    private final OrderService orderService;

    public UserController(UserService userService, OrderService orderService) {
        this.userService = userService;
        this.orderService = orderService;
    }

    /**
     * Get current user profile
     */
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        String email = getCurrentUserEmail();
        logger.info("Fetching profile for user: {}", email);
        UserDTO userDTO = userService.getCurrentUser(email);
        return ResponseEntity.ok(userDTO);
    }

    /**
     * Update current user profile
     */
    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateCurrentUser(@Valid @RequestBody UserUpdateDTO userUpdateDTO) {
        String email = getCurrentUserEmail();
        logger.info("Updating profile for user: {}", email);
        UserDTO updatedUser = userService.updateCurrentUser(email, userUpdateDTO);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Get orders for current user
     */
    @GetMapping("/orders")
    public ResponseEntity<Page<OrderDTO>> getUserOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {

        String email = getCurrentUserEmail();
        UserDTO user = userService.getCurrentUser(email);

        logger.info("Fetching orders for user ID: {}", user.getId());

        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        Page<OrderDTO> orders = orderService.getOrdersByUserId(user.getId(), pageable);
        return ResponseEntity.ok(orders);
    }

    /**
     * Create new order
     */
    @PostMapping("/orders")
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderCreateDTO orderCreateDTO) {
        String email = getCurrentUserEmail();
        UserDTO user = userService.getCurrentUser(email);

        logger.info("Creating new order for user ID: {}", user.getId());
        OrderDTO createdOrder = orderService.createOrder(orderCreateDTO, user.getId());
        return ResponseEntity.ok(createdOrder);
    }

    /**
     * Helper method to get current user email from security context
     */
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
