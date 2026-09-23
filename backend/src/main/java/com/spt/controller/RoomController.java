package com.spt.controller;

import com.spt.dto.request.CreateRoomRequest;
import com.spt.dto.response.RoomResponse;
import com.spt.entity.Game;
import com.spt.security.AuthenticatedUser;
import com.spt.service.GameService;
import com.spt.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {

    private final RoomService roomService;
    private final GameService gameService;

    public RoomController(RoomService roomService, GameService gameService) {
        this.roomService = roomService;
        this.gameService = gameService;
    }

    @PostMapping
    public ResponseEntity<RoomResponse> create(@Valid @RequestBody CreateRoomRequest request) {
        Long userId = AuthenticatedUser.currentUserId();
        return ResponseEntity.status(HttpStatus.CREATED).body(roomService.createRoom(userId, request));
    }

    @GetMapping("/{code}")
    public RoomResponse get(@PathVariable String code) {
        return roomService.getRoom(code);
    }

    @PostMapping("/{code}/join")
    public RoomResponse join(@PathVariable String code) {
        return roomService.join(code, AuthenticatedUser.currentUserId());
    }

    @PostMapping("/{code}/leave")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void leave(@PathVariable String code) {
        roomService.leave(code, AuthenticatedUser.currentUserId());
    }

    @PostMapping("/{code}/start")
    public Map<String, String> start(@PathVariable String code) {
        Game game = roomService.findGameOrThrow(code);
        var seated = roomService.getSeatedUserIds(code);
        String gameId = gameService.startGame(code, seated);
        return Map.of("gameId", gameId);
    }
}
