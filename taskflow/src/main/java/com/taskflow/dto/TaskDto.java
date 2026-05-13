package com.taskflow.dto;

import com.taskflow.enums.Category;
import com.taskflow.enums.Priority;
import com.taskflow.enums.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

public class TaskDto {

    @Data
    public static class CreateRequest {
        @NotBlank(message = "Title is required")
        private String title;

        private String description;

        @NotNull(message = "Priority is required")
        private Priority priority;

        @NotNull(message = "Category is required")
        private Category category;

        private Status status = Status.TODO;
    }

    @Data
    public static class UpdateRequest {
        private String title;
        private String description;
        private Priority priority;
        private Category category;
        private Status status;
    }

    @Data
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private Priority priority;
        private Status status;
        private Category category;
        private String categoryDisplayName;
        private Long userId;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    @AllArgsConstructor
    public static class StatsResponse {
        private long total;
        private long todo;
        private long inProgress;
        private long done;
        private double completionRate;
    }
}