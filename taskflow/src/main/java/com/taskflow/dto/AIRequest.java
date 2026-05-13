package com.taskflow.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class AIRequest {
    private String message;
    private List<Map<String, String>> history;
}