package com.spt.repository;

import com.spt.entity.Move;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.UUID;

public interface MoveRepository extends MongoRepository<Move, String> {
    List<Move> findByGameIdOrderByTurnNumberAsc(UUID gameId);
}
