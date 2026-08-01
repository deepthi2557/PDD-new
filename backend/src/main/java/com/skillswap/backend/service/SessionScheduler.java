package com.skillswap.backend.service;

import com.skillswap.backend.model.Booking;
import com.skillswap.backend.model.Notification;
import com.skillswap.backend.model.User;
import com.skillswap.backend.repository.BookingRepository;
import com.skillswap.backend.repository.NotificationRepository;
import com.skillswap.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SessionScheduler {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final PushNotificationService pushNotificationService;

    @Autowired
    public SessionScheduler(BookingRepository bookingRepository,
                            UserRepository userRepository,
                            NotificationRepository notificationRepository,
                            PushNotificationService pushNotificationService) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.pushNotificationService = pushNotificationService;
    }

    /**
     * Scheduled task running every hour to automatically complete sessions that have passed their scheduled date.
     */
    @Scheduled(cron = "0 0 * * * *") // Runs at the start of every hour
    @Transactional
    public void autoCompletePastSessions() {
        LocalDate today = LocalDate.now();
        
        // Fetch bookings for the last few years up to yesterday
        List<Booking> passedBookings = bookingRepository.findByDateBetween(
                LocalDate.now().minusYears(3),
                today.minusDays(1)
        );

        List<Booking> upcomingPassedBookings = passedBookings.stream()
                .filter(b -> "UPCOMING".equalsIgnoreCase(b.getStatus()))
                .collect(Collectors.toList());

        for (Booking booking : upcomingPassedBookings) {
            booking.setStatus("COMPLETED");
            bookingRepository.save(booking);

            User mentor = booking.getMentor();
            User learner = booking.getLearner();

            // Increment completed sessions count for the mentor
            mentor.setSessionsCompleted(mentor.getSessionsCompleted() + 1);
            userRepository.save(mentor);

            // 1. Learner Notification (Review Prompt)
            Notification learnerNotif = Notification.builder()
                    .user(learner)
                    .type("review")
                    .title("Rate your session: " + booking.getSkill() + " with " + mentor.getName())
                    .icon("⭐")
                    .createdAt(LocalDateTime.now())
                    .build();
            notificationRepository.save(learnerNotif);

            pushNotificationService.sendPushNotification(
                    learner.getExpoPushToken(),
                    "Session completed! 🎉",
                    "How was your session on " + booking.getSkill() + " with " + mentor.getName() + "? Leave a review!",
                    null
            );

            // 2. Mentor Notification (Session Marked Complete)
            Notification mentorNotif = Notification.builder()
                    .user(mentor)
                    .type("booking")
                    .title("Session marked completed on: " + booking.getSkill())
                    .icon("✅")
                    .createdAt(LocalDateTime.now())
                    .build();
            notificationRepository.save(mentorNotif);

            pushNotificationService.sendPushNotification(
                    mentor.getExpoPushToken(),
                    "Session marked complete! ✅",
                    "Your session teaching " + booking.getSkill() + " has been marked complete.",
                    null
            );
        }

        if (!upcomingPassedBookings.isEmpty()) {
            System.out.println("Scheduler: Auto-completed " + upcomingPassedBookings.size() + " passed sessions.");
        }
    }
}
