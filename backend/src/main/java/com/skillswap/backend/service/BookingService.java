package com.skillswap.backend.service;

import com.skillswap.backend.exception.InvalidBookingException;
import com.skillswap.backend.exception.ResourceNotFoundException;
import com.skillswap.backend.model.Booking;
import com.skillswap.backend.model.User;
import com.skillswap.backend.repository.BookingRepository;
import com.skillswap.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Autowired
    public BookingService(BookingRepository bookingRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Booking createBooking(UUID learnerId, UUID mentorId, String skill, LocalDate date, String timeSlot, String type, String notes) {
        if (date.isBefore(LocalDate.now())) {
            throw new InvalidBookingException("Cannot book a session in the past");
        }

        User learner = userRepository.findById(learnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Learner user not found"));
        User mentor = userRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor user not found"));

        if ("offline".equalsIgnoreCase(mentor.getStatus())) {
            throw new InvalidBookingException("Mentor is currently offline and cannot accept bookings");
        }

        Booking booking = Booking.builder()
                .learner(learner)
                .mentor(mentor)
                .skill(skill)
                .date(date)
                .timeSlot(timeSlot)
                .type(type)
                .notes(notes)
                .status("UPCOMING")
                .build();

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking updateBookingStatus(UUID bookingId, String newStatus, String actionByUserIdString) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        String oldStatus = booking.getStatus();
        if (oldStatus.equals(newStatus)) {
            return booking;
        }

        booking.setStatus(newStatus.toUpperCase());

        if ("COMPLETED".equalsIgnoreCase(newStatus)) {
            User mentor = booking.getMentor();
            User learner = booking.getLearner();

            // Increment completed sessions count
            mentor.setSessionsCompleted(mentor.getSessionsCompleted() + 1);
            
            // Adjust attendance rates (completing booking boosts score towards 100)
            mentor.setAttendanceRate(Math.min(100, mentor.getAttendanceRate() + 2));
            learner.setAttendanceRate(Math.min(100, learner.getAttendanceRate() + 2));

            userRepository.save(mentor);
            userRepository.save(learner);
        } else if ("CANCELLED".equalsIgnoreCase(newStatus) && actionByUserIdString != null) {
            UUID actionByUserId = UUID.fromString(actionByUserIdString);
            
            // Late cancellation checks: if cancelled by mentor less than 2 hours before the booking date
            if (actionByUserId.equals(booking.getMentor().getId())) {
                LocalDate bookingDate = booking.getDate();
                if (bookingDate.isEqual(LocalDate.now())) {
                    // Booking is today. Since we don't store exact hourly start timestamps easily,
                    // we assume today's booking is a late cancellation penalty if cancelled on the same day.
                    User mentor = booking.getMentor();
                    mentor.setTrustScore(Math.max(0, mentor.getTrustScore() - 10));
                    userRepository.save(mentor);
                }
            }
        }

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking flagMissedSession(UUID bookingId, UUID flaggerId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        booking.setStatus("CANCELLED");
        
        // Find who missed: if learner missed, deduct from learner's attendanceRate/trustScore
        User offender;
        if (flaggerId.equals(booking.getMentor().getId())) {
            offender = booking.getLearner();
        } else {
            offender = booking.getMentor();
        }

        offender.setMissedSessionsCount(offender.getMissedSessionsCount() + 1);
        offender.setAttendanceRate(Math.max(0, offender.getAttendanceRate() - 10));
        offender.setTrustScore(Math.max(0, offender.getTrustScore() - 15));

        userRepository.save(offender);
        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByUserAndStatus(UUID userId, String role, String status) {
        if ("mentor".equalsIgnoreCase(role)) {
            if (status != null && !status.isEmpty()) {
                return bookingRepository.findByMentorIdAndStatus(userId, status.toUpperCase());
            }
            return bookingRepository.findByMentorId(userId);
        } else {
            if (status != null && !status.isEmpty()) {
                return bookingRepository.findByLearnerIdAndStatus(userId, status.toUpperCase());
            }
            return bookingRepository.findByLearnerId(userId);
        }
    }
}
