package com.skillswap.backend.service;

import com.skillswap.backend.exception.ResourceNotFoundException;
import com.skillswap.backend.model.Booking;
import com.skillswap.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class VideoRoomService {

    private final BookingRepository bookingRepository;

    @Autowired
    public VideoRoomService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    /**
     * Generates a free Jitsi Meet room link for an online booking session.
     * @param bookingId The booking ID.
     * @return The generated Jitsi room URL.
     */
    @Transactional
    public String generateVideoRoom(UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!"Online".equalsIgnoreCase(booking.getType())) {
            throw new IllegalArgumentException("Cannot generate a video room for an offline session");
        }

        // Return existing URL if already generated
        if (booking.getVideoRoomUrl() != null && !booking.getVideoRoomUrl().trim().isEmpty()) {
            return booking.getVideoRoomUrl();
        }

        // Generate secure Jitsi room name
        String uniqueRoomName = "SkillSwap-Session-" + UUID.randomUUID().toString().substring(0, 8);
        String jitsiUrl = "https://meet.jit.si/" + uniqueRoomName;

        booking.setVideoRoomUrl(jitsiUrl);
        bookingRepository.save(booking);

        return jitsiUrl;
    }
}
