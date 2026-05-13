package com.taskflow.dto;

import lombok.Data;

public class UserDto {

    @Data
    public static class UpdateProfileRequest {
        private String mainGoal;
        private String workRhythm;
        private Boolean iaEnabled;
    }

    @Data
    public static class ProfileResponse {
        private Long id;
        private String email;
        private String mainGoal;
        private String workRhythm;
        private boolean iaEnabled;
    }
}