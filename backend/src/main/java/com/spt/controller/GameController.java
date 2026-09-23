package com.spt.controller;

import com.spt.dto.response.GameStateDTO;
import com.spt.dto.response.MoveResponse;
import com.spt.entity.Move;
import com.spt.security.AuthenticatedUser;
import com.spt.service.GameService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/{id}")
    public GameStateDTO get(@PathVariable String id) {
        return gameService.getStateFor(id, AuthenticatedUser.currentUserId());
    }

    @GetMapping("/{id}/history")
    public List<MoveResponse> history(@PathVariable String id) {
        return gameService.getHistory(id).stream()
                .map(m -> new MoveResponse(m.getTurnNumber(), m.getPlayerId(), m.getPassedCardType(), m.getTimestamp()))
                .toList();
    }
}
