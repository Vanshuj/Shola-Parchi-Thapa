package com.spt.repository;

import com.spt.entity.Match;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.UUID;

public interface MatchRepository extends MongoRepository<Match, String> {
    List<Match> findByGameId(UUID gameId);
    List<Match> findByUserIdOrderByCreatedAtDesc(Long userId);
}
