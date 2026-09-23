package com.spt.dto.response;

public class PreferenceResponse {
    private boolean paperTexture;
    private boolean handDrawnBorders;
    private boolean cardAnimations;
    private boolean ambientSounds;
    private boolean sfxEnabled;
    private boolean easterEggs;
    private boolean reduceMotion;

    public PreferenceResponse(boolean paperTexture, boolean handDrawnBorders, boolean cardAnimations,
                               boolean ambientSounds, boolean sfxEnabled, boolean easterEggs,
                               boolean reduceMotion) {
        this.paperTexture = paperTexture;
        this.handDrawnBorders = handDrawnBorders;
        this.cardAnimations = cardAnimations;
        this.ambientSounds = ambientSounds;
        this.sfxEnabled = sfxEnabled;
        this.easterEggs = easterEggs;
        this.reduceMotion = reduceMotion;
    }

    public boolean isPaperTexture() { return paperTexture; }
    public boolean isHandDrawnBorders() { return handDrawnBorders; }
    public boolean isCardAnimations() { return cardAnimations; }
    public boolean isAmbientSounds() { return ambientSounds; }
    public boolean isSfxEnabled() { return sfxEnabled; }
    public boolean isEasterEggs() { return easterEggs; }
    public boolean isReduceMotion() { return reduceMotion; }
}
