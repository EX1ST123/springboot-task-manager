package com.taskflow.service;

import com.taskflow.dto.TaskFilterRequest;
import com.taskflow.dto.TaskDto;
import com.taskflow.dto.TaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.enums.Status;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository; // Assuming you have a UserRepository

    @Transactional
    public TaskResponse createTask(Long userId, TaskRequest taskRequest) {
        log.debug("Creating task for user ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Task task = Task.builder()
                .title(taskRequest.getTitle())
                .description(taskRequest.getDescription())
                .priority(taskRequest.getPriority())
                .status(taskRequest.getStatus() != null ? taskRequest.getStatus() : Status.TODO)
                .category(taskRequest.getCategory())
                .user(user)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        task = taskRepository.save(task);
        log.debug("Task created with ID: {}", task.getId());
        return mapToTaskResponse(task);
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasksForUser(Long userId) {
        log.debug("Fetching all tasks for user ID: {}", userId);
        return taskRepository.findByUserId(userId)
                .stream()
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getFilteredTasksForUser(Long userId, TaskFilterRequest filterRequest) {
        log.debug("Fetching filtered tasks for user ID: {} with filters: {}", userId, filterRequest);
        return taskRepository.findByUserIdWithFilters(
                        userId,
                        filterRequest.getStatus(),
                        filterRequest.getCategory(),
                        filterRequest.getPriority())
                .stream()
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskByIdForUser(Long taskId, Long userId) {
        log.debug("Fetching task by ID: {} for user ID: {}", taskId, userId);
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId + " for user: " + userId));
        return mapToTaskResponse(task);
    }

    @Transactional
    public TaskResponse updateTask(Long taskId, Long userId, TaskRequest taskRequest) {
        log.debug("Updating task ID: {} for user ID: {}", taskId, userId);
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId + " for user: " + userId));

        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setPriority(taskRequest.getPriority());
        task.setStatus(taskRequest.getStatus() != null ? taskRequest.getStatus() : task.getStatus());
        task.setCategory(taskRequest.getCategory());
        task.setUpdatedAt(LocalDateTime.now());

        task = taskRepository.save(task);
        log.debug("Task ID: {} updated successfully.", task.getId());
        return mapToTaskResponse(task);
    }

    @Transactional
    public void deleteTask(Long taskId, Long userId) {
        log.debug("Deleting task ID: {} for user ID: {}", taskId, userId);
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId + " for user: " + userId));
        taskRepository.delete(task);
    }

    @Transactional
    public TaskResponse markTaskAsDone(Long taskId, Long userId) {
        log.debug("Marking task ID: {} as DONE for user ID: {}", taskId, userId);
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId + " for user: " + userId));
        task.markAsCompleted(); // Uses the helper method in Task entity
        task.setUpdatedAt(LocalDateTime.now());
        task = taskRepository.save(task);
        log.debug("Task ID: {} marked as DONE.", task.getId());
        return mapToTaskResponse(task);
    }

    @Transactional
    public TaskResponse markTaskAsInProgress(Long taskId, Long userId) {
        log.debug("Marking task ID: {} as IN_PROGRESS for user ID: {}", taskId, userId);
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId + " for user: " + userId));
        task.markAsInProgress(); // Uses the helper method in Task entity
        task.setUpdatedAt(LocalDateTime.now());
        task = taskRepository.save(task);
        log.debug("Task ID: {} marked as IN_PROGRESS.", task.getId());
        return mapToTaskResponse(task);
    }

    @Transactional(readOnly = true)
    public long countTasksForUser(Long userId) {
        log.debug("Counting total tasks for user ID: {}", userId);
        return taskRepository.countByUserId(userId);
    }

    @Transactional(readOnly = true)
    public long countTasksByStatusForUser(Long userId, Status status) {
        log.debug("Counting tasks by status: {} for user ID: {}", status, userId);
        return taskRepository.countByUserIdAndStatus(userId, status);
    }

    @Transactional(readOnly = true)
    public TaskDto.StatsResponse getTaskStatsForUser(Long userId) {
        log.debug("Fetching task statistics for user ID: {}", userId);
        long totalTasks = countTasksForUser(userId);
        long todoTasks = countTasksByStatusForUser(userId, Status.TODO);
        long inProgressTasks = countTasksByStatusForUser(userId, Status.IN_PROGRESS);
        long doneTasks = countTasksByStatusForUser(userId, Status.DONE);

        double completionRate = (totalTasks > 0) ? ((double) doneTasks / totalTasks) * 100 : 0.0;

        return new TaskDto.StatsResponse(
                totalTasks,
                todoTasks,
                inProgressTasks,
                doneTasks,
                completionRate
        );
    }

    private TaskResponse mapToTaskResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setPriority(task.getPriority());
        response.setStatus(task.getStatus());
        response.setCategory(task.getCategory());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());
        response.setUserId(task.getUser().getId());
        return response;
    }
}