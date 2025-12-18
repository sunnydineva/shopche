package com.shop.controller;

import com.shop.dto.user.AdminUserUpdateDTO;
import com.shop.dto.user.UserDTO;
import com.shop.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for admin user management endpoints
 */
@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private static final Logger logger = LoggerFactory.getLogger(AdminUserController.class);
    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Get all users with pagination (admin)
     */
    @GetMapping
    public ResponseEntity<Page<UserDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "asc") String direction) {

        logger.info("Admin fetching all users with pagination");

        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        Page<UserDTO> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    /**
     * Get user by ID (admin)
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        logger.info("Admin fetching user with ID: {}", id);
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Update user (admin)
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody AdminUserUpdateDTO userUpdateDTO) {

        logger.info("Admin updating user with ID: {}", id);
        UserDTO updatedUser = userService.updateUserByAdmin(id, userUpdateDTO);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Deactivate user (admin)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deactivateUser(@PathVariable Long id) {
        logger.info("Admin deactivating user with ID: {}", id);
        userService.deactivateUser(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User successfully deactivated");
        return ResponseEntity.ok(response);
    }
}