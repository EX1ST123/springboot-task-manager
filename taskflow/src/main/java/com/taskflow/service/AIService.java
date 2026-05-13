package com.taskflow.service;
import com.taskflow.enums.Status;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.taskflow.dto.AITipContext;
import com.taskflow.dto.TaskDto.StatsResponse;
import com.taskflow.dto.TaskResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String MODEL_NAME = "gemini-2.5-flash-lite";

    private static final String SYSTEM_PROMPT = "You are a helpful productivity assistant embedded in TaskFlow, a task management app. " +
            "You have access to the user's tasks and can help them manage their workload. " +
            "Help users manage their tasks better, prioritize work, overcome procrastination, and stay productive. " +
            "Keep answers concise and practical (2–4 sentences unless a longer answer is clearly needed). " +
            "You may ask clarifying questions. Be warm but efficient.";

    // New method that includes task context
   public String chatWithContext(String message, List<Map<String, String>> history, 
                            List<TaskResponse> userTasks, Long userId) {
    try {
        Client client = Client.builder().apiKey(apiKey).build();
        
        // Build the conversation
        StringBuilder prompt = new StringBuilder();
        prompt.append(SYSTEM_PROMPT).append("\n\n");
        
        // Add task context
        if (userTasks != null && !userTasks.isEmpty()) {
            prompt.append("User's current tasks:\n");
            for (TaskResponse task : userTasks.stream()
                    .filter(t -> t.getStatus() != Status.DONE)
                    .limit(5)
                    .collect(Collectors.toList())) {
                prompt.append(String.format("- %s (%s priority, %s)\n",
                    task.getTitle(),
                    task.getPriority(),
                    task.getStatus()
                ));
            }
            prompt.append("\n");
        }
        
        // Add conversation history
        if (history != null && !history.isEmpty()) {
            for (Map<String, String> msg : history) {
                String role = msg.get("role");
                String content = msg.get("content");
                if ("user".equals(role)) {
                    prompt.append("User: ").append(content).append("\n");
                } else if ("assistant".equals(role)) {
                    prompt.append("Assistant: ").append(content).append("\n");
                }
            }
        }
        
        prompt.append("User: ").append(message).append("\n");
        prompt.append("Assistant:");
        
        // Log the prompt for debugging
        log.debug("Sending prompt to Gemini: {}", prompt.toString());
        
        GenerateContentResponse response = client.models.generateContent(
            MODEL_NAME,
            prompt.toString(),
            null
        );
        
        String responseText = response.text();
        log.debug("Received response from Gemini: {}", responseText);
        
        return responseText != null && !responseText.isEmpty() ? 
               responseText : "I'm not sure how to respond to that.";
        
    } catch (Exception e) {
        log.error("Gemini API error: ", e);
        // Return a more helpful error message
        return "I'm having trouble connecting right now. Please check if the Gemini API is properly configured. Error: " + e.getMessage();
    }
}
    // Keep original method for compatibility
    public String chat(String message, List<Map<String, String>> history) {
        return chatWithContext(message, history, null, null);
    }

    public String generateProductivityTip(AITipContext context) {
        try {
            Client client = Client.builder().apiKey(apiKey).build();
            
            StringBuilder prompt = new StringBuilder();
            prompt.append("You are a concise productivity coach. ");
            prompt.append("Give ONE short, specific, actionable productivity tip (max 2 sentences). ");
            prompt.append("No preamble, no bullet points. Just the tip itself.\n\n");
            
            if (context != null && context.getStats() != null) {
                StatsResponse stats = context.getStats();
                prompt.append(String.format(
                    "User stats: %d total tasks (%d todo, %d in progress, %d done, %.0f%% complete). ",
                    stats.getTotal(), stats.getTodo(), stats.getInProgress(), 
                    stats.getDone(), stats.getCompletionRate()
                ));
            }
            
            GenerateContentResponse response = client.models.generateContent(
                MODEL_NAME,
                prompt.toString(),
                null
            );
            
            String tip = response.text();
            return tip != null && !tip.isEmpty() ? tip : "Try breaking down your largest task into smaller steps!";
            
        } catch (Exception e) {
            log.error("Gemini tip generation error: ", e);
            return "Try breaking down your largest task into smaller steps!";
        }
    }
}