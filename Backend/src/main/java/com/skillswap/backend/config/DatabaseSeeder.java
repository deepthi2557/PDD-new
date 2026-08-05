package com.skillswap.backend.config;

import com.skillswap.backend.model.User;
import com.skillswap.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.UUID;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    public DatabaseSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            System.out.println("🌱 Database is empty. Seeding initial mentors...");

            // Aria Shah
            User aria = User.builder()
                    .id(UUID.fromString("11111111-1111-1111-1111-111111111111"))
                    .name("Aria Shah")
                    .email("aria.shah@example.com")
                    .role("mentor")
                    .avatarUrl("https://api.dicebear.com/7.x/avataaars/png?seed=Aria&backgroundColor=c4b5fd,bfdbfe,a7f3d0,e9d5ff")
                    .expertise("AI & Machine Learning")
                    .level("Expert")
                    .teaches(6)
                    .rating(4.9)
                    .reviews(184)
                    .status("online")
                    .tags(Arrays.asList("Python", "TensorFlow", "Data Science"))
                    .badge("Top Contributor")
                    .mode("Hybrid")
                    .confidence("High")
                    .bio("ML researcher helping students break into AI. I love turning complex ideas into intuitive lessons.")
                    .trustScore(98)
                    .attendanceRate(99)
                    .missedSessionsCount(0)
                    .followers(1240)
                    .sessionsCompleted(312)
                    .positive(97)
                    .build();

            // Leo Park
            User leo = User.builder()
                    .id(UUID.fromString("22222222-2222-2222-2222-222222222222"))
                    .name("Leo Park")
                    .email("leo.park@example.com")
                    .role("mentor")
                    .avatarUrl("https://api.dicebear.com/7.x/avataaars/png?seed=Leo&backgroundColor=c4b5fd,bfdbfe,a7f3d0,e9d5ff")
                    .expertise("UI/UX Design")
                    .level("Expert")
                    .teaches(4)
                    .rating(4.8)
                    .reviews(142)
                    .status("busy")
                    .tags(Arrays.asList("Figma", "Prototyping", "Design Systems"))
                    .badge("Verified Mentor")
                    .mode("Online")
                    .confidence("Medium")
                    .bio("Product designer at a fintech startup. Sharing real-world workflows.")
                    .trustScore(94)
                    .attendanceRate(96)
                    .missedSessionsCount(0)
                    .followers(890)
                    .sessionsCompleted(201)
                    .positive(95)
                    .build();

            // Maya Iyer
            User maya = User.builder()
                    .id(UUID.fromString("33333333-3333-3333-3333-333333333333"))
                    .name("Maya Iyer")
                    .email("maya.iyer@example.com")
                    .role("mentor")
                    .avatarUrl("https://api.dicebear.com/7.x/avataaars/png?seed=Maya&backgroundColor=c4b5fd,bfdbfe,a7f3d0,e9d5ff")
                    .expertise("Full-Stack Coding")
                    .level("Intermediate")
                    .teaches(5)
                    .rating(4.7)
                    .reviews(98)
                    .status("online")
                    .tags(Arrays.asList("React", "Node", "TypeScript"))
                    .badge("Trending Mentor")
                    .mode("Online")
                    .confidence("Beginner Friendly")
                    .bio("Self-taught developer. I make code feel approachable.")
                    .trustScore(92)
                    .attendanceRate(94)
                    .missedSessionsCount(0)
                    .followers(540)
                    .sessionsCompleted(156)
                    .positive(96)
                    .build();

            // Noah Fields
            User noah = User.builder()
                    .id(UUID.fromString("44444444-4444-4444-4444-444444444444"))
                    .name("Noah Fields")
                    .email("noah.fields@example.com")
                    .role("mentor")
                    .avatarUrl("https://api.dicebear.com/7.x/avataaars/png?seed=Noah&backgroundColor=c4b5fd,bfdbfe,a7f3d0,e9d5ff")
                    .expertise("Public Speaking")
                    .level("Expert")
                    .teaches(3)
                    .rating(4.9)
                    .reviews(211)
                    .status("offline")
                    .tags(Arrays.asList("Communication", "Debate", "Storytelling"))
                    .badge("Top Contributor")
                    .mode("Hybrid")
                    .confidence("High")
                    .bio("Debate coach with 10+ years guiding students to nationals.")
                    .trustScore(96)
                    .attendanceRate(98)
                    .missedSessionsCount(0)
                    .followers(1502)
                    .sessionsCompleted(401)
                    .positive(98)
                    .build();

            // Sara Kim
            User sara = User.builder()
                    .id(UUID.fromString("55555555-5555-5555-5555-555555555555"))
                    .name("Sara Kim")
                    .email("sara.kim@example.com")
                    .role("mentor")
                    .avatarUrl("https://api.dicebear.com/7.x/avataaars/png?seed=Sara&backgroundColor=c4b5fd,bfdbfe,a7f3d0,e9d5ff")
                    .expertise("Mathematics")
                    .level("Intermediate")
                    .teaches(4)
                    .rating(4.6)
                    .reviews(76)
                    .status("online")
                    .tags(Arrays.asList("Calculus", "Linear Algebra", "Stats"))
                    .badge("Verified Mentor")
                    .mode("Online")
                    .confidence("Beginner Friendly")
                    .bio("Math TA who makes proofs click.")
                    .trustScore(90)
                    .attendanceRate(92)
                    .missedSessionsCount(0)
                    .followers(320)
                    .sessionsCompleted(88)
                    .positive(94)
                    .build();

            // Ravi Mehta
            User ravi = User.builder()
                    .id(UUID.fromString("66666666-6666-6666-6666-666666666666"))
                    .name("Ravi Mehta")
                    .email("ravi.mehta@example.com")
                    .role("mentor")
                    .avatarUrl("https://api.dicebear.com/7.x/avataaars/png?seed=Ravi&backgroundColor=c4b5fd,bfdbfe,a7f3d0,e9d5ff")
                    .expertise("Video Editing")
                    .level("Expert")
                    .teaches(3)
                    .rating(4.8)
                    .reviews(154)
                    .status("busy")
                    .tags(Arrays.asList("Premiere", "After Effects", "DaVinci"))
                    .badge("Trending Mentor")
                    .mode("Online")
                    .confidence("Medium")
                    .bio("Editor for indie creators. Workflow obsessed.")
                    .trustScore(93)
                    .attendanceRate(95)
                    .missedSessionsCount(0)
                    .followers(720)
                    .sessionsCompleted(178)
                    .positive(96)
                    .build();

            userRepository.saveAll(Arrays.asList(aria, leo, maya, noah, sara, ravi));
            System.out.println("✅ Database seeded successfully with 6 mentors!");
        } else {
            System.out.println("ℹ️ Database already has users. Skipping seeder.");
        }
    }
}
