package com.spt.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spt.dto.request.CreateRoomRequest;
import com.spt.dto.request.RegisterRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import com.spt.repository.GameRepository;
import com.spt.repository.UserRepository;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Covers the REST slice of the room/game lifecycle: register, create a room,
 * start it, and read back the resulting per-player game state. The 15s-timer
 * and multi-socket pass flow are exercised by the frontend Playwright suite,
 * which can drive two real browser contexts over the WebSocket connection.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class GameFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GameRepository gameRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        gameRepository.deleteAll();
    }

    private String registerAndGetToken(String username, String email) throws Exception {
        RegisterRequest register = new RegisterRequest();
        register.setUsername(username);
        register.setEmail(email);
        register.setPassword("password123");

        MvcResult result = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
    }

    @Test
    void createRoom_thenStart_producesActiveGameWithFourCardHand() throws Exception {
        String hostToken = registerAndGetToken("host_player", "host_player@example.com");

        CreateRoomRequest createRoom = new CreateRoomRequest();
        createRoom.setMaxPlayers(4);
        createRoom.setPrivate(true);

        MvcResult createResult = mockMvc.perform(post("/api/v1/rooms")
                        .header("Authorization", "Bearer " + hostToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRoom)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("WAITING"))
                .andReturn();

        String roomCode = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("roomCode").asText();

        MvcResult startResult = mockMvc.perform(post("/api/v1/rooms/" + roomCode + "/start")
                        .header("Authorization", "Bearer " + hostToken))
                .andExpect(status().isOk())
                .andReturn();

        String gameId = objectMapper.readTree(startResult.getResponse().getContentAsString())
                .get("gameId").asText();

        mockMvc.perform(get("/api/v1/games/" + gameId)
                        .header("Authorization", "Bearer " + hostToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACTIVE"))
                .andExpect(jsonPath("$.yourHand.length()").value(4))
                .andExpect(jsonPath("$.opponents").isArray());
    }
}
