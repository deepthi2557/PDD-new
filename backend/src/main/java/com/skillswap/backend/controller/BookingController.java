package com.skillswap.backend.controller;

import com.skillswap.backend.model.Booking;
import com.skillswap.backend.model.Review;
import com.skillswap.backend.model.User;
import com.skillswap.backend.repository.ReviewRepository;
import com.skillswap.backend.service.BookingService;
import com.skillswap.backend.service.UserService;
import com.skillswap.backend.service.VideoRoomService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final UserService userService;
    private final ReviewRepository reviewRepository;
    private final VideoRoomService videoRoomService;

    @Autowired
    public BookingController(BookingService bookingService, UserService userService, ReviewRepository reviewRepository, VideoRoomService videoRoomService) {
        this.bookingService = bookingService;
        this.userService = userService;
        this.reviewRepository = reviewRepository;
        this.videoRoomService = videoRoomService;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody BookingRequest request) {
        UUID learnerId = UUID.fromString(jwt.getSubject());
        
        // Ensure user is synced
        String email = jwt.getClaimAsString("email");
        String name = jwt.getClaimAsString("name");
        userService.getOrCreateUser(learnerId, email, name);

        LocalDate bookingDate = LocalDate.parse(request.getDate());

        Booking booking = bookingService.createBooking(
                learnerId,
                request.getMentorId(),
                request.getSkill(),
                bookingDate,
                request.getTimeSlot(),
                request.getType(),
                request.getNotes()
        );

        return ResponseEntity.ok(booking);
    }

    @GetMapping("/my-activity")
    public ResponseEntity<List<Booking>> getMyActivity(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false, defaultValue = "learner") String role,
            @RequestParam(required = false) String status) {
        UUID userId = UUID.fromString(jwt.getSubject());
        
        List<Booking> bookings = bookingService.getBookingsByUserAndStatus(userId, role, status);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            @RequestParam String status) {
        UUID actionByUserId = UUID.fromString(jwt.getSubject());
        
        Booking updated = bookingService.updateBookingStatus(id, status, actionByUserId.toString());
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/video-room")
    public ResponseEntity<String> generateVideoRoom(
            @PathVariable UUID id) {
        String roomUrl = videoRoomService.generateVideoRoom(id);
        return ResponseEntity.ok(roomUrl);
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<Review> rateSession(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            @RequestBody RateRequest request) {
        UUID authorId = UUID.fromString(jwt.getSubject());

        Booking booking = bookingService.updateBookingStatus(id, "COMPLETED", null);
        if (!booking.getLearner().getId().equals(authorId)) {
            return ResponseEntity.status(403).build();
        }

        booking.setRating(request.getRating());

        User mentor = booking.getMentor();
        User author = booking.getLearner();

        Review review = Review.builder()
                .mentor(mentor)
                .author(author)
                .rating(request.getRating())
                .text(request.getText())
                .build();

        Review savedReview = reviewRepository.save(review);
        return ResponseEntity.ok(savedReview);
    }

    @PostMapping("/{id}/flag-missed")
    public ResponseEntity<Booking> flagMissedSession(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id) {
        UUID flaggerId = UUID.fromString(jwt.getSubject());
        
        Booking booking = bookingService.flagMissedSession(id, flaggerId);
        return ResponseEntity.ok(booking);
    }

    @Getter
    @Setter
    public static class BookingRequest {
        private UUID mentorId;
        private String skill;
        private String date; // Format: YYYY-MM-DD
        private String timeSlot;
        private String type;
        private String notes;
    }

    @Getter
    @Setter
    public static class RateRequest {
        private Integer rating;
        private String text;
    }
}
