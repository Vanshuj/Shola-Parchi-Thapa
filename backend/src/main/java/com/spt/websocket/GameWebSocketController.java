package com.spt.websocket;

import com.spt.dto.request.ChatMessageRequest;
import com.spt.dto.request.PassCardRequest;
import com.spt.repository.UserRepository;
import com.spt.service.GameService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.Instant;
import java.util.Map;

@Controller
public class GameWebSocketController {

    private static final Logger log = LoggerFactory.getLogger(GameWebSocketController.class);

    private final GameService gameService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    public GameWebSocketController(GameService gameService,
                                   SimpMessagingTemplate messagingTemplate,
                                   UserRepository userRepository) {
        this.gameService = gameService;
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
    }

    @MessageMapping("/game/{gameId}/pass")
    public void pass(@DestinationVariable String gameId, PassCardRequest request, Principal principal) {
        if (principal == null) {
            log.warn("Unauthorized pass attempt for game {}", gameId);
            return;
        }
        Long userId = Long.valueOf(principal.getName());
        try {
            gameService.pass(gameId, userId, request.getCardId());
        } catch (RuntimeException ex) {
            messagingTemplate.convertAndSendToUser(String.valueOf(userId), "/queue/errors",
                    Map.of("code", "MOVE_REJECTED", "message", ex.getMessage()));
        }
    }

    @MessageMapping("/game/{gameId}/ready")
    public void ready(@DestinationVariable String gameId, Principal principal) {
        if (principal == null) {
            log.warn("Unauthorized ready attempt for game {}", gameId);
            return;
        }
        Long userId = Long.valueOf(principal.getName());
        gameService.handleReconnect(gameId, userId);
    }

    @MessageMapping("/game/{gameId}/chat")
    public void chat(@DestinationVariable String gameId, ChatMessageRequest request, Principal principal) {
        if (principal == null) {
            log.warn("Unauthorized chat attempt for game {}", gameId);
            return;
        }
        Long userId = Long.valueOf(principal.getName());
        String username = userRepository.findById(userId)
                .map(u -> u.getUsername())
                .orElse("Player " + userId);

        messagingTemplate.convertAndSend("/topic/game/" + gameId + "/chat",
                Map.of("from", username, "text", request.getText(), "timestamp", Instant.now()));
    }
}
