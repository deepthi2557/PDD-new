package com.skillswap.backend.controller;

import com.skillswap.backend.model.User;
import com.skillswap.backend.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @Autowired
    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping("/public/mentors")
    public ResponseEntity<List<User>> getTopMentorsPublic() {
        return ResponseEntity.ok(leaderboardService.getTopMentors());
    }

    @GetMapping("/public/skills")
    public ResponseEntity<List<LeaderboardService.SkillGrowthDTO>> getTrendingSkillsPublic() {
        return ResponseEntity.ok(leaderboardService.getTrendingSkills());
    }

    @GetMapping("/mentors")
    public ResponseEntity<List<User>> getTopMentors() {
        return ResponseEntity.ok(leaderboardService.getTopMentors());
    }

    @GetMapping("/skills")
    public ResponseEntity<List<LeaderboardService.SkillGrowthDTO>> getTrendingSkills() {
        return ResponseEntity.ok(leaderboardService.getTrendingSkills());
    }
}
