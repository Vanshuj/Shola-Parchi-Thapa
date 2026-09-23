package com.spt.engine;

import java.util.Objects;

/** Immutable value object representing a single parchi (chit). */
public final class Card {
    private final String id;
    private final CardType type;

    public Card(String id, CardType type) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Card id must not be blank");
        }
        if (type == null) {
            throw new IllegalArgumentException("Card type must not be null");
        }
        this.id = id;
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public CardType getType() {
        return type;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Card)) return false;
        Card card = (Card) o;
        return id.equals(card.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Card{id='" + id + "', type=" + type + '}';
    }
}
