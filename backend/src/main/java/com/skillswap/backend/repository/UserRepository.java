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

    @Query("SELECT DISTINCT u FROM User u LEFT JOIN u.tags t WHERE " +
           "(:tags IS NULL OR t IN :tags) " +
           "AND (:name IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:level IS NULL OR u.level = :level) " +
           "AND (:mode IS NULL OR u.mode = :mode)")
    List<User> findUsersByTagsAndName(
            @Param("tags") List<String> tags,
            @Param("name") String name,
            @Param("level") String level,
            @Param("mode") String mode
    );
}
