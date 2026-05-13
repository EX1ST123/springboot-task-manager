package com.taskflow.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// ── Request DTOs ──────────────────────────────────────────

public class AuthDto {

    @Data
    public static class RegisterRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        private String mainGoal;
        private String workRhythm;
    }

    @Data
    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String type = "Bearer";
        private Long userId;
        private String email;
        private String mainGoal;
        private String workRhythm;
        private boolean iaEnabled;

        public AuthResponse(String token, Long userId, String email,
                            String mainGoal, String workRhythm, boolean iaEnabled) {
            this.token = token;
            this.userId = userId;
            this.email = email;
            this.mainGoal = mainGoal;
            this.workRhythm = workRhythm;
            this.iaEnabled = iaEnabled;
        }
    }
}