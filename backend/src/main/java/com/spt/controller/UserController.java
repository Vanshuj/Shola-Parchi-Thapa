package com.spt.controller;

import com.spt.dto.response.UserResponse;
import com.spt.security.AuthenticatedUser;
import com.spt.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse me() {
        return userService.getById(AuthenticatedUser.currentUserId());
    }

    @GetMapping("/{id}/stats")
    public Map<String, Integer> stats(@PathVariable Long id) {
        return userService.getStats(id);
    }
}
