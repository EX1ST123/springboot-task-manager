package com.taskflow.dto;

import lombok.Data;
import com.taskflow.dto.TaskDto.StatsResponse;
import java.util.List;
import java.util.Map;

@Data
public class AITipContext {
    private StatsResponse stats;
    private List<Map<String, String>> tasks;
}