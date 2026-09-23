package com.spt.websocket;

import com.spt.service.CardLabelService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;

@Controller
public class LabelWebSocketController {

    private final CardLabelService cardLabelService;
    private final SimpMessagingTemplate messagingTemplate;

    public LabelWebSocketController(CardLabelService cardLabelService, SimpMessagingTemplate messagingTemplate) {
        this.cardLabelService = cardLabelService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/user/labels")
    public void updateLabels(Map<String, String> labels, Principal principal) {
        Long userId = Long.valueOf(principal.getName());
        Map<String, String> updated = cardLabelService.updateLabels(userId, labels);
        messagingTemplate.convertAndSendToUser(String.valueOf(userId), "/queue/labels", updated);
    }
}
