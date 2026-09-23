package com.spt.service;

import com.spt.dto.request.PreferenceUpdateRequest;
import com.spt.dto.response.PreferenceResponse;
import com.spt.entity.UserPreference;
import com.spt.repository.UserPreferenceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class PreferenceService {

    private final UserPreferenceRepository repository;

    public PreferenceService(UserPreferenceRepository repository) {
        this.repository = repository;
    }

    public PreferenceResponse getPreferences(Long userId) {
        UserPreference pref = repository.findById(userId).orElseGet(() -> defaultFor(userId));
        return toResponse(pref);
    }

    @Transactional
    public PreferenceResponse updatePreferences(Long userId, PreferenceUpdateRequest request) {
        UserPreference pref = repository.findById(userId).orElseGet(() -> defaultFor(userId));
        if (request.getPaperTexture() != null) pref.setPaperTexture(request.getPaperTexture());
        if (request.getHandDrawnBorders() != null) pref.setHandDrawnBorders(request.getHandDrawnBorders());
        if (request.getCardAnimations() != null) pref.setCardAnimations(request.getCardAnimations());
        if (request.getAmbientSounds() != null) pref.setAmbientSounds(request.getAmbientSounds());
        if (request.getSfxEnabled() != null) pref.setSfxEnabled(request.getSfxEnabled());
        if (request.getEasterEggs() != null) pref.setEasterEggs(request.getEasterEggs());
        if (request.getReduceMotion() != null) pref.setReduceMotion(request.getReduceMotion());
        pref.setUpdatedAt(Instant.now());
        return toResponse(repository.save(pref));
    }

    private UserPreference defaultFor(Long userId) {
        UserPreference pref = new UserPreference();
        pref.setUserId(userId);
        return pref;
    }

    private PreferenceResponse toResponse(UserPreference p) {
        return new PreferenceResponse(p.isPaperTexture(), p.isHandDrawnBorders(), p.isCardAnimations(),
                p.isAmbientSounds(), p.isSfxEnabled(), p.isEasterEggs(), p.isReduceMotion());
    }
}
