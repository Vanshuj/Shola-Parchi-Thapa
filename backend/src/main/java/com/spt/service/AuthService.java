package com.spt.service;

import com.spt.dto.request.LoginRequest;
import com.spt.dto.request.RegisterRequest;
import com.spt.dto.response.AuthResponse;
import com.spt.entity.User;
import com.spt.exception.ConflictException;
import com.spt.exception.UnauthorizedException;
import com.spt.repository.UserRepository;
import com.spt.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final SequenceGeneratorService sequenceGeneratorService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       SequenceGeneratorService sequenceGeneratorService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.sequenceGeneratorService = sequenceGeneratorService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("EMAIL_TAKEN", "Email already registered");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ConflictException("EMAIL_TAKEN", "Username already taken");
        }
        User user = new User();
        user.setId(sequenceGeneratorService.generateSequence("users_sequence"));
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user = userRepository.save(user);
        String token = jwtService.generateToken(user.getId(), user.getUsername());
        return new AuthResponse(user.getId(), user.getUsername(), token);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("AUTH_INVALID", "Invalid email or password"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("AUTH_INVALID", "Invalid email or password");
        }
        String token = jwtService.generateToken(user.getId(), user.getUsername());
        return new AuthResponse(user.getId(), user.getUsername(), token);
    }
}
