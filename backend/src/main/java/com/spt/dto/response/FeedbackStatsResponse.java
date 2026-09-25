package com.spt.dto.response;

import java.util.Map;

public class FeedbackStatsResponse {

    private long totalFeedback;
    private double averageRating;
    private Map<String, Long> categoryCounts;

    public FeedbackStatsResponse() {
    }

    public FeedbackStatsResponse(long totalFeedback, double averageRating, Map<String, Long> categoryCounts) {
        this.totalFeedback = totalFeedback;
        this.averageRating = averageRating;
        this.categoryCounts = categoryCounts;
    }

    public long getTotalFeedback() {
        return totalFeedback;
    }

    public void setTotalFeedback(long totalFeedback) {
        this.totalFeedback = totalFeedback;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public Map<String, Long> getCategoryCounts() {
        return categoryCounts;
    }

    public void setCategoryCounts(Map<String, Long> categoryCounts) {
        this.categoryCounts = categoryCounts;
    }
}
