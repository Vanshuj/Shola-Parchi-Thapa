package com.spt.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "user_preferences")
public class UserPreference {

    @Id
    private Long userId;

    private boolean paperTexture = true;

    private boolean handDrawnBorders = true;

    private boolean cardAnimations = true;

    private boolean ambientSounds = false;

    private boolean sfxEnabled = false;

    private boolean easterEggs = true;

    private boolean reduceMotion = false;

    private Instant updatedAt = Instant.now();

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public boolean isPaperTexture() { return paperTexture; }
    public void setPaperTexture(boolean paperTexture) { this.paperTexture = paperTexture; }

    public boolean isHandDrawnBorders() { return handDrawnBorders; }
    public void setHandDrawnBorders(boolean handDrawnBorders) { this.handDrawnBorders = handDrawnBorders; }

    public boolean isCardAnimations() { return cardAnimations; }
    public void setCardAnimations(boolean cardAnimations) { this.cardAnimations = cardAnimations; }

    public boolean isAmbientSounds() { return ambientSounds; }
    public void setAmbientSounds(boolean ambientSounds) { this.ambientSounds = ambientSounds; }

    public boolean isSfxEnabled() { return sfxEnabled; }
    public void setSfxEnabled(boolean sfxEnabled) { this.sfxEnabled = sfxEnabled; }

    public boolean isEasterEggs() { return easterEggs; }
    public void setEasterEggs(boolean easterEggs) { this.easterEggs = easterEggs; }

    public boolean isReduceMotion() { return reduceMotion; }
    public void setReduceMotion(boolean reduceMotion) { this.reduceMotion = reduceMotion; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
