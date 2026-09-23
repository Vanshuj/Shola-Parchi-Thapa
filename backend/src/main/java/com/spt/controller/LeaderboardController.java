package com.spt.controller;

import com.spt.dto.response.LeaderboardEntryResponse;
import com.spt.entity.User;
import com.spt.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/leaderboard")
public class LeaderboardController {

    private final UserRepository userRepository;

    public LeaderboardController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<LeaderboardEntryResponse> leaderboard(@RequestParam(defaultValue = "100") int limit) {
        List<User> users = userRepository.findAll(
                PageRequest.of(0, Math.min(limit, 500), Sort.by(Sort.Direction.DESC, "eloRating"))
        ).getContent();
        List<LeaderboardEntryResponse> result = new java.util.ArrayList<>();
        int rank = 1;
        for (User u : users) {
            result.add(new LeaderboardEntryResponse(rank++, u.getUsername(), u.getEloRating(), u.getWins(), u.getLosses()));
        }
        return result;
    }
}
