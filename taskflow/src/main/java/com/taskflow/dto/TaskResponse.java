package com.taskflow.dto;

import com.taskflow.enums.Category;
import com.taskflow.enums.Priority;
import com.taskflow.enums.Status;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private Priority priority;
    private Status status;
    private Category category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId; // To indicate which user owns this task
}