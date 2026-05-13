package com.taskflow.dto;

import com.taskflow.enums.Category;
import com.taskflow.enums.Priority;
import com.taskflow.enums.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TaskRequest {

    @NotBlank(message = "Title cannot be empty")
    private String title;

    private String description;

    @NotNull(message = "Priority cannot be null")
    private Priority priority;

    private Status status = Status.TODO; // Default status

    private Category category;
}