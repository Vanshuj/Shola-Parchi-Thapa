package com.spt.engine;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/** A seat at the table. userId is null for empty/ghost seats which auto-pass. */
public final class Player {
    private final int seatIndex;
    private final Long userId;
    private final String username;
    private final List<Card> hand = new ArrayList<>();
    private boolean connected = true;
    private boolean forfeited = false;

    public Player(int seatIndex, Long userId, String username) {
        this.seatIndex = seatIndex;
        this.userId = userId;
        this.username = username;
    }

    public int getSeatIndex() {
        return seatIndex;
    }

    public Optional<Long> getUserId() {
        return Optional.ofNullable(userId);
    }

    public String getUsername() {
        return username;
    }

    public boolean isGhost() {
        return userId == null;
    }

    public List<Card> getHand() {
        return Collections.unmodifiableList(hand);
    }

    public void addCard(Card card) {
        hand.add(card);
    }

    public void removeCard(Card card) {
        if (!hand.remove(card)) {
            throw new IllegalStateException("Card " + card.getId() + " not in hand of player " + seatIndex);
        }
    }

    public boolean hasCard(String cardId) {
        return hand.stream().anyMatch(c -> c.getId().equals(cardId));
    }

    public Card findCard(String cardId) {
        return hand.stream()
                .filter(c -> c.getId().equals(cardId))
                .findFirst()
                .orElseThrow(() -> new com.spt.engine.exception.InvalidCardException(
                        "Card " + cardId + " not in hand"));
    }

    public boolean isConnected() {
        return connected;
    }

    public void setConnected(boolean connected) {
        this.connected = connected;
    }

    public boolean isForfeited() {
        return forfeited;
    }

    public void setForfeited(boolean forfeited) {
        this.forfeited = forfeited;
    }

    /** True if player holds 4 cards of the same type (four-of-a-kind). */
    public boolean hasWinningHand() {
        if (hand.size() < 4) return false;
        java.util.Map<CardType, Long> counts = hand.stream()
                .collect(java.util.stream.Collectors.groupingBy(Card::getType, java.util.stream.Collectors.counting()));
        return counts.values().stream().anyMatch(count -> count >= 4);
    }
}
