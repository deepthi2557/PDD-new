package com.skillswap.backend.controller;

import com.skillswap.backend.model.User;
import com.skillswap.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/mentors")
public class MentorController {

    private final UserService userService;

    @Autowired
    public MentorController(UserService userService) {
        this.userService = userService;
    }

    // Public endpoint to query mentors (allowed in security config)
    @GetMapping("/public")
    public ResponseEntity<List<User>> getPublicMentors(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String mode,
            @RequestParam(required = false) String tag) {
        List<User> mentors = userService.searchMentors(name, level, mode, tag);
        return ResponseEntity.ok(mentors);
    }

    @GetMapping
    public ResponseEntity<List<User>> getMentors(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String mode,
            @RequestParam(required = false) String tag) {
        List<User> mentors = userService.searchMentors(name, level, mode, tag);
        return ResponseEntity.ok(mentors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getMentorById(@PathVariable UUID id) {
        User mentor = userService.getUserById(id);
        return ResponseEntity.ok(mentor);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody User profileDetails) {
        UUID userId = UUID.fromString(jwt.getSubject());
        
        // Auto-create or fetch user to ensure they are synchronized in our DB
        String email = jwt.getClaimAsString("email");
        String name = jwt.getClaimAsString("name");
        userService.getOrCreateUser(userId, email, name);

        User updated = userService.updateUserProfile(userId, profileDetails);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/status")
    public ResponseEntity<User> updateStatus(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam String status) {
        UUID userId = UUID.fromString(jwt.getSubject());
        
        String email = jwt.getClaimAsString("email");
        String name = jwt.getClaimAsString("name");
        userService.getOrCreateUser(userId, email, name);

        User updated = userService.updateUserStatus(userId, status);
        return ResponseEntity.ok(updated);
    }
}
