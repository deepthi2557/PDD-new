package com.skillswap.backend.repository;

import com.skillswap.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    List<User> findByRole(String role);

    @Query("SELECT u FROM User u WHERE u.role = :role " +
           "AND (:name IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:level IS NULL OR u.level = :level) " +
           "AND (:mode IS NULL OR u.mode = :mode)")
    List<User> findMentorsWithFilters(
            @Param("role") String role,
            @Param("name") String name,
            @Param("level") String level,
            @Param("mode") String mode
    );

    @Query("SELECT u FROM User u JOIN u.tags t WHERE u.role = :role AND t = :tag")
    List<User> findMentorsByTag(@Param("role") String role, @Param("tag") String tag);
}
