package com.spt.dto.request;

public class PreferenceUpdateRequest {

    private Boolean paperTexture;
    private Boolean handDrawnBorders;
    private Boolean cardAnimations;
    private Boolean ambientSounds;
    private Boolean sfxEnabled;
    private Boolean easterEggs;
    private Boolean reduceMotion;

    public Boolean getPaperTexture() { return paperTexture; }
    public void setPaperTexture(Boolean paperTexture) { this.paperTexture = paperTexture; }

    public Boolean getHandDrawnBorders() { return handDrawnBorders; }
    public void setHandDrawnBorders(Boolean handDrawnBorders) { this.handDrawnBorders = handDrawnBorders; }

    public Boolean getCardAnimations() { return cardAnimations; }
    public void setCardAnimations(Boolean cardAnimations) { this.cardAnimations = cardAnimations; }

    public Boolean getAmbientSounds() { return ambientSounds; }
    public void setAmbientSounds(Boolean ambientSounds) { this.ambientSounds = ambientSounds; }

    public Boolean getSfxEnabled() { return sfxEnabled; }
    public void setSfxEnabled(Boolean sfxEnabled) { this.sfxEnabled = sfxEnabled; }

    public Boolean getEasterEggs() { return easterEggs; }
    public void setEasterEggs(Boolean easterEggs) { this.easterEggs = easterEggs; }

    public Boolean getReduceMotion() { return reduceMotion; }
    public void setReduceMotion(Boolean reduceMotion) { this.reduceMotion = reduceMotion; }
}
