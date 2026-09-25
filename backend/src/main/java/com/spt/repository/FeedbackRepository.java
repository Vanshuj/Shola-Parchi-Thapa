package com.spt.repository;

import com.spt.entity.Feedback;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FeedbackRepository extends MongoRepository<Feedback, String> {
    List<Feedback> findAllByOrderByCreatedAtDesc();
    List<Feedback> findTop10ByOrderByCreatedAtDesc();
    List<Feedback> findByUserIdOrderByCreatedAtDesc(Long userId);
    long countByCategory(String category);
}
