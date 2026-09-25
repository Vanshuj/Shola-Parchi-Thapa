package com.spt.dto.response;

import java.time.Instant;

public class FeedbackResponse {

    private String id;
    private String category;
    private int rating;
    private String subject;
    private String message;
    private String username;
    private Instant createdAt;
    private String status;

    public FeedbackResponse() {
    }

    public FeedbackResponse(String id, String category, int rating, String subject, String message, String username, Instant createdAt, String status) {
        this.id = id;
        this.category = category;
        this.rating = rating;
        this.subject = subject;
        this.message = message;
        this.username = username;
        this.createdAt = createdAt;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
