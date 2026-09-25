package com.spt.controller;

import com.spt.dto.request.FeedbackCreateRequest;
import com.spt.dto.response.FeedbackResponse;
import com.spt.dto.response.FeedbackStatsResponse;
import com.spt.entity.Feedback;
import com.spt.entity.User;
import com.spt.repository.FeedbackRepository;
import com.spt.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/feedback")
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    public FeedbackController(FeedbackRepository feedbackRepository, UserRepository userRepository) {
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<FeedbackResponse> submitFeedback(@Valid @RequestBody FeedbackCreateRequest request) {
        Long authenticatedUserId = getAuthenticatedUserId();
        String username = request.getName() != null && !request.getName().isBlank() 
                ? request.getName().trim() 
                : "Baithak Sathi";
        String email = request.getEmail() != null && !request.getEmail().isBlank() 
                ? request.getEmail().trim() 
                : null;

        if (authenticatedUserId != null) {
            Optional<User> userOpt = userRepository.findById(authenticatedUserId);
            if (userOpt.isPresent()) {
                User u = userOpt.get();
                if (request.getName() == null || request.getName().isBlank()) {
                    username = u.getUsername();
                }
                if (email == null && u.getEmail() != null) {
                    email = u.getEmail();
                }
            }
        }

        String category = request.getCategory() != null && !request.getCategory().isBlank()
                ? request.getCategory().trim().toUpperCase()
                : "GENERAL";

        int rating = request.getRating() != null ? Math.max(1, Math.min(5, request.getRating())) : 5;

        Feedback feedback = new Feedback(
                authenticatedUserId,
                username,
                email,
                category,
                rating,
                request.getSubject() != null ? request.getSubject().trim() : null,
                request.getMessage().trim(),
                request.getDeviceInfo()
        );

        Feedback saved = feedbackRepository.save(feedback);

        FeedbackResponse response = new FeedbackResponse(
                saved.getId(),
                saved.getCategory(),
                saved.getRating(),
                saved.getSubject(),
                saved.getMessage(),
                saved.getUsername(),
                saved.getCreatedAt(),
                "RECEIVED"
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<FeedbackStatsResponse> getStats() {
        List<Feedback> all = feedbackRepository.findAll();
        long count = all.size();
        double avg = count > 0 
                ? all.stream().mapToInt(Feedback::getRating).average().orElse(5.0) 
                : 5.0;

        Map<String, Long> categoryCounts = new HashMap<>();
        for (Feedback f : all) {
            String cat = f.getCategory() != null ? f.getCategory() : "GENERAL";
            categoryCounts.put(cat, categoryCounts.getOrDefault(cat, 0L) + 1);
        }

        // Round avg to 1 decimal place
        double roundedAvg = Math.round(avg * 10.0) / 10.0;

        return ResponseEntity.ok(new FeedbackStatsResponse(count, roundedAvg, categoryCounts));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<FeedbackResponse>> getRecentFeedback() {
        List<Feedback> recent = feedbackRepository.findTop10ByOrderByCreatedAtDesc();
        List<FeedbackResponse> responses = recent.stream().map(f -> new FeedbackResponse(
                f.getId(),
                f.getCategory(),
                f.getRating(),
                f.getSubject(),
                f.getMessage(),
                f.getUsername(),
                f.getCreatedAt(),
                "RECEIVED"
        )).toList();

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/my")
    public ResponseEntity<List<FeedbackResponse>> getMyFeedback() {
        Long authenticatedUserId = getAuthenticatedUserId();
        if (authenticatedUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Feedback> myFeedback = feedbackRepository.findByUserIdOrderByCreatedAtDesc(authenticatedUserId);
        List<FeedbackResponse> responses = myFeedback.stream().map(f -> new FeedbackResponse(
                f.getId(),
                f.getCategory(),
                f.getRating(),
                f.getSubject(),
                f.getMessage(),
                f.getUsername(),
                f.getCreatedAt(),
                "RECEIVED"
        )).toList();

        return ResponseEntity.ok(responses);
    }

    private Long getAuthenticatedUserId() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof UserDetails userDetails) {
                return Long.valueOf(userDetails.getUsername());
            }
        } catch (Exception ignored) {
        }
        return null;
    }
}
