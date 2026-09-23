package com.spt.repository;

import com.spt.entity.Game;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;
import java.util.UUID;

public interface GameRepository extends MongoRepository<Game, UUID> {
    Optional<Game> findByRoomCode(String roomCode);
    boolean existsByRoomCode(String roomCode);
}
