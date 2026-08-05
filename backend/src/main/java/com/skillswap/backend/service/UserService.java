package com.skillswap.backend.service;

import com.skillswap.backend.exception.ResourceNotFoundException;
import com.skillswap.backend.model.User;
import com.skillswap.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Transactional
    public User getOrCreateUser(UUID id, String email, String name) {
        return userRepository.findById(id).orElseGet(() -> {
            User newUser = User.builder()
                    .id(id)
                    .email(email)
                    .name(name != null ? name : "User_" + email.split("@")[0])
                    .role("student")
                    .status("online")
                    .build();
            return userRepository.save(newUser);
        });
    }

    @Transactional
    public User updateUserProfile(UUID id, User updatedProfile) {
        User existingUser = getUserById(id);
        
        if (updatedProfile.getName() != null) existingUser.setName(updatedProfile.getName());
        if (updatedProfile.getPhone() != null) existingUser.setPhone(updatedProfile.getPhone());
        if (updatedProfile.getRole() != null) existingUser.setRole(updatedProfile.getRole());
        if (updatedProfile.getAvatarUrl() != null) existingUser.setAvatarUrl(updatedProfile.getAvatarUrl());
        if (updatedProfile.getBio() != null) existingUser.setBio(updatedProfile.getBio());
        if (updatedProfile.getExpertise() != null) existingUser.setExpertise(updatedProfile.getExpertise());
        if (updatedProfile.getTags() != null) existingUser.setTags(updatedProfile.getTags());
        if (updatedProfile.getLevel() != null) existingUser.setLevel(updatedProfile.getLevel());
        if (updatedProfile.getMode() != null) existingUser.setMode(updatedProfile.getMode());
        if (updatedProfile.getBadge() != null) existingUser.setBadge(updatedProfile.getBadge());
        if (updatedProfile.getTeaches() != null) existingUser.setTeaches(updatedProfile.getTeaches());
        if (updatedProfile.getRating() != null) existingUser.setRating(updatedProfile.getRating());
        if (updatedProfile.getReviews() != null) existingUser.setReviews(updatedProfile.getReviews());
        if (updatedProfile.getConfidence() != null) existingUser.setConfidence(updatedProfile.getConfidence());
        if (updatedProfile.getPositive() != null) existingUser.setPositive(updatedProfile.getPositive());
        
        return userRepository.save(existingUser);
    }

    @Transactional
    public User updateUserStatus(UUID id, String status) {
        User user = getUserById(id);
        user.setStatus(status.toLowerCase());
        return userRepository.save(user);
    }

    public List<User> searchMentors(String name, String level, String mode, String tag) {
        if (tag != null && !tag.isEmpty()) {
            return userRepository.findMentorsByTag("mentor", tag);
        }
        return userRepository.findMentorsWithFilters("mentor", name, level, mode);
    }
}
