package com.spt.repository;

import com.spt.entity.CardLabel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CardLabelRepository extends MongoRepository<CardLabel, String> {
    List<CardLabel> findByUserId(Long userId);
    Optional<CardLabel> findByUserIdAndCardType(Long userId, String cardType);
    void deleteByUserId(Long userId);
}
