package com.taskflow.controller;

import com.taskflow.dto.TaskFilterRequest;
import com.taskflow.dto.TaskDto;
import com.taskflow.dto.TaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Task Management", description = "Endpoints for managing user tasks")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @Operation(summary = "Create a new task for the authenticated user")
    public ResponseEntity<TaskResponse> createTask(@AuthenticationPrincipal Long userId,
                                                   @Valid @RequestBody TaskRequest taskRequest) {
        return new ResponseEntity<>(taskService.createTask(userId, taskRequest), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all tasks for the authenticated user, with optional filters")
    public ResponseEntity<List<TaskResponse>> getTasks(@AuthenticationPrincipal Long userId,
                                                       @ModelAttribute TaskFilterRequest filterRequest) {
        List<TaskResponse> tasks = taskService.getFilteredTasksForUser(userId, filterRequest);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{taskId}")
    @Operation(summary = "Get a specific task by ID for the authenticated user")
    public ResponseEntity<TaskResponse> getTaskById(@AuthenticationPrincipal Long userId,
                                                    @PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.getTaskByIdForUser(taskId, userId));
    }

    @PutMapping("/{taskId}")
    @Operation(summary = "Update an existing task for the authenticated user")
    public ResponseEntity<TaskResponse> updateTask(@AuthenticationPrincipal Long userId,
                                                    @PathVariable Long taskId,
                                                    @Valid @RequestBody TaskRequest taskRequest) {
        return ResponseEntity.ok(taskService.updateTask(taskId, userId, taskRequest));
    }

    @PatchMapping("/{taskId}/complete")
    @Operation(summary = "Mark a task as complete")
    public ResponseEntity<TaskResponse> markComplete(@AuthenticationPrincipal Long userId,
                                                    @PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.markTaskAsDone(taskId, userId));
    }

    @PatchMapping("/{taskId}/in-progress")
    @Operation(summary = "Mark a task as in progress")
    public ResponseEntity<TaskResponse> markInProgress(@AuthenticationPrincipal Long userId,
                                                        @PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.markTaskAsInProgress(taskId, userId));
    }

    @DeleteMapping("/{taskId}")
    @Operation(summary = "Delete a task for the authenticated user")
    public ResponseEntity<Void> deleteTask(@AuthenticationPrincipal Long userId,
                                           @PathVariable Long taskId) {
        taskService.deleteTask(taskId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    @Operation(summary = "Get task statistics for the authenticated user")
    public ResponseEntity<TaskDto.StatsResponse> getTaskStats(@AuthenticationPrincipal Long userId) {
        TaskDto.StatsResponse stats = taskService.getTaskStatsForUser(userId);
        return ResponseEntity.ok(stats);
    }
}