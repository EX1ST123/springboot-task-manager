package com.taskflow.controller;

import com.taskflow.dto.AIRequest;
import com.taskflow.service.AIService;
import com.taskflow.service.TaskService;
import com.taskflow.dto.AITipContext;
import com.taskflow.dto.TaskResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Assistant", description = "Gemini-powered AI chat and tips")
public class AIController {

    private final AIService aiService;
    private final TaskService taskService;  // Add this

    @PostMapping("/chat")
    @Operation(summary = "Send a chat message to Gemini AI")
    public ResponseEntity<Map<String, String>> chat(
            @AuthenticationPrincipal Long userId,
            @RequestBody AIRequest request) {
        
        // Fetch user's tasks to provide context
        List<TaskResponse> userTasks = taskService.getAllTasksForUser(userId);
        
        // Pass tasks to the AI service
        String response = aiService.chatWithContext(
            request.getMessage(), 
            request.getHistory(),
            userTasks,
            userId
        );
        return ResponseEntity.ok(Map.of("response", response));
    }

    @PostMapping("/tip")
    @Operation(summary = "Generate a productivity tip")
    public ResponseEntity<Map<String, String>> generateTip(
            @AuthenticationPrincipal Long userId,
            @RequestBody(required = false) AITipContext context) {
        String tip = aiService.generateProductivityTip(context);
        return ResponseEntity.ok(Map.of("tip", tip));
    }
}