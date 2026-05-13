package com.taskflow.service;

import com.taskflow.dto.AuthDto;
import com.taskflow.entity.User;
import com.taskflow.repository.UserRepository;
import com.taskflow.security.JwtUtils;
import com.taskflow.exception.UserAlreadyExistsException;
import com.taskflow.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implements Scénario A – Authentification from the sequence diagram:
 *   authenticate(dto) → findByUsername() → verify hash → generateJWT(userId)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    /**
     * POST /api/auth/register
     * User.register(email, password, mainGoal)
     */
    @Transactional
    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        if (!isEmailUnique(request.getEmail())) {
            throw new UserAlreadyExistsException(
                "Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .mainGoal(request.getMainGoal())
                .workRhythm(request.getWorkRhythm())
                .iaEnabled(true)
                .build();

        user = userRepository.save(user);
        log.info("New user registered: {}", user.getEmail());

        String token = jwtUtils.generateJWT(user.getId());
        return toAuthResponse(token, user);
    }

    /**
     * POST /api/auth/login
     * authenticate(dto) from sequence diagram
     */
    @Transactional(readOnly = true)
    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        // findByUsername() → Optional<User>
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        // vérifier hash du mot de passe
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        // generateJWT(userId) → 200 OK (token, user)
        String token = jwtUtils.generateJWT(user.getId());
        log.info("User logged in: {}", user.getEmail());
        return toAuthResponse(token, user);
    }

    public boolean isEmailUnique(String email) {
        return !userRepository.existsByEmail(email);
    }

    private AuthDto.AuthResponse toAuthResponse(String token, User user) {
        return new AuthDto.AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getMainGoal(),
                user.getWorkRhythm(),
                user.isIaEnabled()
        );
    }
}