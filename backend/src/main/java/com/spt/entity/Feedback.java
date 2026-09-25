package com.spt.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "feedback")
public class Feedback {

    @Id
    private String id;

    private Long userId;

    private String username;

    private String email;

    private String category; // GAMEPLAY, AUDIO_MUSIC, VISUALS_3D, BUG_REPORT, SUGGESTION, GENERAL

    private int rating = 5; // 1 to 5 stars / chai cups

    private String subject;

    private String message;

    private String deviceInfo;

    private Instant createdAt = Instant.now();

    public Feedback() {
    }

    public Feedback(Long userId, String username, String email, String category, int rating, String subject, String message, String deviceInfo) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.category = category;
        this.rating = rating;
        this.subject = subject;
        this.message = message;
        this.deviceInfo = deviceInfo;
        this.createdAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getDeviceInfo() {
        return deviceInfo;
    }

    public void setDeviceInfo(String deviceInfo) {
        this.deviceInfo = deviceInfo;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
