package com.taskflow.dto;

import com.taskflow.enums.Category;
import com.taskflow.enums.Priority;
import com.taskflow.enums.Status;
import lombok.Data;

@Data
public class TaskFilterRequest {
    private Status status;
    private Category category;
    private Priority priority;
    // Add other filterable fields as needed
}