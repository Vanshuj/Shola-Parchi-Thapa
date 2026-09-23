package com.spt.controller;

import com.spt.dto.request.PreferenceUpdateRequest;
import com.spt.dto.response.PreferenceResponse;
import com.spt.security.AuthenticatedUser;
import com.spt.service.PreferenceService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/me/preferences")
public class PreferenceController {

    private final PreferenceService preferenceService;

    public PreferenceController(PreferenceService preferenceService) {
        this.preferenceService = preferenceService;
    }

    @GetMapping
    public PreferenceResponse get() {
        return preferenceService.getPreferences(AuthenticatedUser.currentUserId());
    }

    @PutMapping
    public PreferenceResponse update(@RequestBody PreferenceUpdateRequest request) {
        return preferenceService.updatePreferences(AuthenticatedUser.currentUserId(), request);
    }
}
