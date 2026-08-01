package com.skillswap.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "learner_id", referencedColumnName = "id", nullable = false)
    private User learner;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mentor_id", referencedColumnName = "id", nullable = false)
    private User mentor;

    @NotNull
    @Column(name = "skill")
    private String skill;

    @NotNull
    @Column(name = "date")
    private LocalDate date;

    @NotNull
    @Column(name = "time_slot")
    private String timeSlot; // e.g. "3:00 PM"

    @NotNull
    @Column(name = "type")
    private String type; // "Online", "Offline"

    @Column(name = "notes", length = 1000)
    private String notes;

    @NotNull
    @Column(name = "status")
    @Builder.Default
    private String status = "UPCOMING"; // "UPCOMING", "COMPLETED", "CANCELLED"

    @Column(name = "rating")
    @Builder.Default
    private Integer rating = 0; // 0 means unrated, otherwise 1-5

    @Column(name = "video_room_url")
    private String videoRoomUrl;
}
