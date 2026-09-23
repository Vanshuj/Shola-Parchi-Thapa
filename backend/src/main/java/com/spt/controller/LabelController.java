package com.spt.controller;

import com.spt.dto.request.LabelUpdateRequest;
import com.spt.dto.response.LabelResponse;
import com.spt.security.AuthenticatedUser;
import com.spt.service.CardLabelService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class LabelController {

    private final CardLabelService cardLabelService;

    public LabelController(CardLabelService cardLabelService) {
        this.cardLabelService = cardLabelService;
    }

    @GetMapping("/users/me/labels")
    public Map<String, Map<String, String>> getLabels() {
        return Map.of("labels", cardLabelService.getLabels(AuthenticatedUser.currentUserId()));
    }

    @PutMapping("/users/me/labels")
    public Map<String, Object> updateLabels(@RequestBody Map<String, Map<String, String>> body) {
        Map<String, String> updated = cardLabelService.updateLabels(
                AuthenticatedUser.currentUserId(), body.getOrDefault("labels", Map.of()));
        return Map.of("labels", updated, "updatedAt", java.time.Instant.now());
    }

    @PutMapping("/users/me/labels/{cardType}")
    public LabelResponse updateOne(@PathVariable String cardType, @Valid @RequestBody LabelUpdateRequest request) {
        return cardLabelService.updateOne(AuthenticatedUser.currentUserId(), cardType, request.getLabel());
    }

    @DeleteMapping("/users/me/labels")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reset() {
        cardLabelService.resetToDefaults(AuthenticatedUser.currentUserId());
    }

    @GetMapping("/labels/presets")
    public List<Map<String, Object>> presets() {
        return List.of(
                Map.of("id", "family", "name", "Family Pack", "labels", Map.of(
                        "TYPE_1", "Mummy", "TYPE_2", "Papa", "TYPE_3", "Didi", "TYPE_4", "Bhaiya")),
                Map.of("id", "cricket", "name", "Cricket Pack", "labels", Map.of(
                        "TYPE_1", "Googly", "TYPE_2", "Sixer", "TYPE_3", "Wicket", "TYPE_4", "Century")),
                Map.of("id", "festival", "name", "Festival Pack", "labels", Map.of(
                        "TYPE_1", "\uD83E\uDED5", "TYPE_2", "\uD83E\uDE94", "TYPE_3", "\u2728", "TYPE_4", "\uD83C\uDF87")),
                Map.of("id", "bollywood", "name", "Bollywood Pack", "labels", Map.of(
                        "TYPE_1", "Hero", "TYPE_2", "Heroine", "TYPE_3", "Villain", "TYPE_4", "Comedian"))
        );
    }
}
