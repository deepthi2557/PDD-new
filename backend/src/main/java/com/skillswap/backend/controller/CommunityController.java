package com.skillswap.backend.controller;

import com.skillswap.backend.exception.ResourceNotFoundException;
import com.skillswap.backend.model.Post;
import com.skillswap.backend.model.User;
import com.skillswap.backend.repository.PostRepository;
import com.skillswap.backend.service.UserService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/community")
public class CommunityController {

    private final PostRepository postRepository;
    private final UserService userService;

    @Autowired
    public CommunityController(PostRepository postRepository, UserService userService) {
        this.postRepository = postRepository;
        this.userService = userService;
    }

    @GetMapping("/posts")
    public ResponseEntity<List<Post>> getAllPosts(@RequestParam(required = false) String tag) {
        List<Post> posts;
        if (tag != null && !tag.isEmpty()) {
            posts = postRepository.findByTagOrderByCreatedAtDesc(tag);
        } else {
            posts = postRepository.findAllByOrderByCreatedAtDesc();
        }
        return ResponseEntity.ok(posts);
    }

    @PostMapping("/posts")
    public ResponseEntity<Post> createPost(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody PostRequest request) {
        UUID authorId = UUID.fromString(jwt.getSubject());
        
        // Sync user
        String email = jwt.getClaimAsString("email");
        String name = jwt.getClaimAsString("name");
        User author = userService.getOrCreateUser(authorId, email, name);

        Post post = Post.builder()
                .author(author)
                .title(request.getTitle())
                .content(request.getContent())
                .tag(request.getTag())
                .build();

        Post saved = postRepository.save(post);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/posts/{id}/like")
    public ResponseEntity<Post> likePost(@PathVariable UUID id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        
        post.setLikesCount(post.getLikesCount() + 1);
        Post updated = postRepository.save(post);
        return ResponseEntity.ok(updated);
    }

    @Getter
    @Setter
    public static class PostRequest {
        private String title;
        private String content;
        private String tag;
    }
}
