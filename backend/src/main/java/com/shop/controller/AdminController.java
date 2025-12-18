package com.shop.controller;

import com.shop.dto.order.OrderDTO;
import com.shop.dto.order.OrderStatusUpdateDTO;
import com.shop.dto.product.ProductCreateDTO;
import com.shop.dto.product.ProductDTO;
import com.shop.dto.product.ProductUpdateDTO;
import com.shop.service.OrderService;
import com.shop.service.ProductService;
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
 * Controller for admin endpoints
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    private final ProductService productService;
    private final OrderService orderService;

    public AdminController(ProductService productService, OrderService orderService) {
        this.productService = productService;
        this.orderService = orderService;
    }

    /**
     * Admin dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, String>> getAdminDashboard() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Admin dashboard accessed successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * Get all products with pagination (admin)
     */
    @GetMapping("/products")
    public ResponseEntity<Page<ProductDTO>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "asc") String direction) {

        logger.info("Admin fetching all products with pagination");

        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        Page<ProductDTO> products = productService.getAllProducts(pageable);
        return ResponseEntity.ok(products);
    }

    /**
     * Create new product (admin)
     */
    @PostMapping("/products")
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductCreateDTO productCreateDTO) {
        logger.info("Admin creating new product: {}", productCreateDTO.getName());
        ProductDTO createdProduct = productService.createProduct(productCreateDTO);
        return ResponseEntity.ok(createdProduct);
    }

    /**
     * Update product (admin)
     */
    @PutMapping("/products/{id}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateDTO productUpdateDTO) {

        logger.info("Admin updating product with ID: {}", id);
        ProductDTO updatedProduct = productService.updateProduct(id, productUpdateDTO);
        return ResponseEntity.ok(updatedProduct);
    }

    /**
     * Delete (deactivate) product (admin)
     */
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        logger.info("Admin deleting product with ID: {}", id);
        productService.deleteProduct(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Product successfully deleted");
        return ResponseEntity.ok(response);
    }

    /**
     * Get all orders with pagination (admin)
     */
    @GetMapping("/orders")
    public ResponseEntity<Page<OrderDTO>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {

        logger.info("Admin fetching all orders with pagination");

        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        Page<OrderDTO> orders = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }

    /**
     * Update order status (admin)
     */
    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateDTO statusUpdateDTO) {

        logger.info("Admin updating status for order ID: {} to {}", id, statusUpdateDTO.getStatus());
        OrderDTO updatedOrder = orderService.updateOrderStatus(id, statusUpdateDTO);
        return ResponseEntity.ok(updatedOrder);
    }
}
