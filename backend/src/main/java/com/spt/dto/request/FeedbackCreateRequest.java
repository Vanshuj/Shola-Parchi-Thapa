package com.spt.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class FeedbackCreateRequest {

    @NotBlank(message = "Feedback message cannot be empty")
    @Size(max = 2500, message = "Message must be under 2500 characters")
    private String message;

    private String category;

    @Min(1)
    @Max(5)
    private Integer rating = 5;

    @Size(max = 120, message = "Subject must be under 120 characters")
    private String subject;

    @Size(max = 80, message = "Name must be under 80 characters")
    private String name;

    @Size(max = 120, message = "Email must be under 120 characters")
    private String email;

    private String deviceInfo;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDeviceInfo() {
        return deviceInfo;
    }

    public void setDeviceInfo(String deviceInfo) {
        this.deviceInfo = deviceInfo;
    }
}
