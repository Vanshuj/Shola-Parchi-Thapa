package com.spt.websocket;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

/**
 * Logs disconnects. Per-game disconnect-grace handling is driven by explicit
 * client "leave" signaling and the TurnScheduler poll, since STOMP session
 * disconnects don't carry which gameId a user was seated in reliably enough
 * to auto-forfeit from this listener alone.
 */
@Component
public class PresenceEventListener {

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        SimpMessageHeaderAccessor accessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();
        org.slf4j.LoggerFactory.getLogger(PresenceEventListener.class)
                .info("WebSocket session disconnected: {}", sessionId);
    }
}
