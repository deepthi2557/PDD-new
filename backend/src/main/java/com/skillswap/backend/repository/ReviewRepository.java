package com.skillswap.backend.repository;

import com.skillswap.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {

    List<Review> findByMentorId(UUID mentorId);

    List<Review> findByMentorIdOrderByCreatedAtDesc(UUID mentorId);
}
