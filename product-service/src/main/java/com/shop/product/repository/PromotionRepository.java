package com.shop.product.repository;

import com.shop.product.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    List<Promotion> findByProductId(Long productId);

    Optional<Promotion> findFirstByProductIdAndActiveTrueAndStartAtLessThanEqualAndEndAtGreaterThanEqualOrderByPriorityDescCreatedAtDesc(
            Long productId,
            LocalDateTime startAt,
            LocalDateTime endAt);
}
