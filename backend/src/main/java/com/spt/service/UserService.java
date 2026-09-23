package com.spt.service;

import com.spt.dto.response.UserResponse;
import com.spt.entity.User;
import com.spt.exception.NotFoundException;
import com.spt.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse getById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("USER_NOT_FOUND", "User not found"));
        return toResponse(user);
    }

    public Map<String, Integer> getStats(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("USER_NOT_FOUND", "User not found"));
        return Map.of("wins", user.getWins(), "losses", user.getLosses(), "eloRating", user.getEloRating());
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getEmail(),
                user.getEloRating(), user.getWins(), user.getLosses());
    }
}
