package com.skillswap.backend.service;

import com.skillswap.backend.model.Booking;
import com.skillswap.backend.model.User;
import com.skillswap.backend.repository.BookingRepository;
import com.skillswap.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    @Autowired
    public LeaderboardService(UserRepository userRepository, BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<User> getTopMentors() {
        List<User> mentors = userRepository.findByRole("mentor");
        mentors.sort((m1, m2) -> {
            int score1 = calculateMentorScore(m1);
            int score2 = calculateMentorScore(m2);
            return Integer.compare(score2, score1); // descending order
        });
        return mentors;
    }

    private int calculateMentorScore(User mentor) {
        // Average rating calculation: we can assume a fallback or read directly from the user's rating field.
        // Let's assume a default base rating of 4.5 if not set, or query reviews average if available.
        // For simplicity, we use User rating which is derived from sessions rating.
        // Formula: (rating * 100) + (sessionsCompleted * 10) + trustScore
        double rating = 4.5; // default fallback if rating not populated yet
        int score = (int) (rating * 100) + (mentor.getSessionsCompleted() * 10) + mentor.getTrustScore();
        return score;
    }

    public List<SkillGrowthDTO> getTrendingSkills() {
        LocalDate today = LocalDate.now();
        LocalDate sevenDaysAgo = today.minusDays(7);
        LocalDate fourteenDaysAgo = today.minusDays(14);

        // Fetch bookings for the last 14 days
        List<Booking> recentBookings = bookingRepository.findByDateBetween(fourteenDaysAgo, today);

        // Separate into two periods
        Map<String, Long> last7DaysCounts = recentBookings.stream()
                .filter(b -> b.getDate().isAfter(sevenDaysAgo) || b.getDate().isEqual(sevenDaysAgo))
                .collect(Collectors.groupingBy(Booking::getSkill, Collectors.counting()));

        Map<String, Long> prior7DaysCounts = recentBookings.stream()
                .filter(b -> b.getDate().isBefore(sevenDaysAgo))
                .collect(Collectors.groupingBy(Booking::getSkill, Collectors.counting()));

        Set<String> allSkills = new HashSet<>();
        allSkills.addAll(last7DaysCounts.keySet());
        allSkills.addAll(prior7DaysCounts.keySet());

        List<SkillGrowthDTO> trendingSkills = new ArrayList<>();
        for (String skill : allSkills) {
            long current = last7DaysCounts.getOrDefault(skill, 0L);
            long prior = prior7DaysCounts.getOrDefault(skill, 0L);

            double growth = 0.0;
            if (prior > 0) {
                growth = ((double) (current - prior) / prior) * 100;
            } else if (current > 0) {
                growth = 100.0; // 100% growth since it's brand new
            }

            String growthString = String.format("%+d%%", (int) Math.round(growth));
            trendingSkills.add(new SkillGrowthDTO(skill, growthString, growth));
        }

        // Sort descending by growth rate numeric value
        trendingSkills.sort((s1, s2) -> Double.compare(s2.getNumericGrowth(), s1.getNumericGrowth()));
        return trendingSkills;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class SkillGrowthDTO {
        private String name;
        private String growth;
        private double numericGrowth;
    }
}
