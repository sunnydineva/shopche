package com.shop.repository;

import com.shop.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Find products by category id
    List<Product> findByCategoryId(Long categoryId);
    
    // Find products by category id with pagination
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    
    // Find active products
    List<Product> findByIsActiveTrue();
    
    // Find active products with pagination
    Page<Product> findByIsActiveTrue(Pageable pageable);
    
    // Find products by name containing text
    List<Product> findByNameContainingIgnoreCase(String name);
    
    // Find products by name containing text with pagination
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    // Find products by price range
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    // Find products by price range with pagination
    Page<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    
    // Complex query to find products by multiple criteria
    @Query("SELECT p FROM Product p WHERE " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "p.isActive = true")
    Page<Product> findProductsByFilters(
            @Param("categoryId") Long categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("name") String name,
            Pageable pageable);
}