package com.skillswap.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @Column(name = "id")
    private UUID id; // Matches the Supabase Auth UID

    @NotNull
    @Column(name = "name")
    private String name;

    @Email
    @NotNull
    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "role")
    private String role; // "student", "mentor", "learner", "expert"

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "bio", length = 1000)
    private String bio;

    @Column(name = "expertise")
    private String expertise;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_tags", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "tag")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @Column(name = "level")
    private String level; // "Beginner Friendly", "Intermediate", "Expert"

    @Column(name = "mode")
    private String mode; // "Online", "Offline", "Hybrid"

    @Column(name = "badge")
    private String badge; // "Verified Mentor", "Top Contributor", "Trending Mentor"

    @Column(name = "trust_score")
    @Builder.Default
    private Integer trustScore = 100;

    @Column(name = "attendance_rate")
    @Builder.Default
    private Integer attendanceRate = 100;

    @Column(name = "missed_sessions_count")
    @Builder.Default
    private Integer missedSessionsCount = 0;

    @Column(name = "status")
    @Builder.Default
    private String status = "offline"; // "online", "busy", "offline"

    @Column(name = "followers")
    @Builder.Default
    private Integer followers = 0;

    @Column(name = "sessions_completed")
    @Builder.Default
    private Integer sessionsCompleted = 0;

    @Column(name = "expo_push_token")
    private String expoPushToken;
}
