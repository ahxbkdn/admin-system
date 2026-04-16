package com.example.ai.controller;

import com.example.ai.entity.AiMessage;
import com.example.ai.mapper.AiMessageMapper;
import com.example.common.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {
    @Autowired
    private AiMessageMapper aiMessageMapper;

    @PostMapping("/generate-content")
    public ApiResponse generateContent(@RequestBody Map<String, Object> request) {
        String prompt = (String) request.get("prompt");
        String type = (String) request.get("type");
        Long userId = request.containsKey("userId") ? Long.valueOf(request.get("userId").toString()) : null;

        // 模拟AI生成内容
        String content = "这是AI生成的" + type + "内容，基于提示：" + prompt;

        // 保存记录
        AiMessage message = new AiMessage();
        message.setUserId(userId);
        message.setPrompt(prompt);
        message.setResponse(content);
        message.setType(type);
        message.setCreateTime(LocalDateTime.now());
        aiMessageMapper.insert(message);

        Map<String, Object> result = new HashMap<>();
        result.put("content", content);
        result.put("type", type);

        return ApiResponse.success(result);
    }

    @PostMapping("/analyze-course")
    public ApiResponse analyzeCourse(@RequestBody Map<String, Object> request) {
        Long courseId = Long.valueOf(request.get("courseId").toString());
        String courseName = (String) request.get("courseName");

        // 模拟课程分析
        Map<String, Object> result = new HashMap<>();
        result.put("courseId", courseId);
        result.put("courseName", courseName);
        result.put("analysis", "课程分析结果：这是一门关于" + courseName + "的课程，内容丰富，结构清晰。");
        result.put("suggestions", "建议添加更多实践案例和互动环节。");

        return ApiResponse.success(result);
    }

    @GetMapping("/health")
    public ApiResponse healthCheck() {
        return ApiResponse.success("AI service is healthy");
    }
}