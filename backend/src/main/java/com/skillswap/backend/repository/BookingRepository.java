package com.skillswap.backend.repository;

import com.skillswap.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    List<Booking> findByLearnerId(UUID learnerId);

    List<Booking> findByMentorId(UUID mentorId);

    List<Booking> findByLearnerIdAndStatus(UUID learnerId, String status);

    List<Booking> findByMentorIdAndStatus(UUID mentorId, String status);

    List<Booking> findByDateBetween(LocalDate startDate, LocalDate endDate);
}
