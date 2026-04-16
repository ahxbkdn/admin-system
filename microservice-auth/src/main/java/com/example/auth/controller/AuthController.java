package com.example.auth.controller;

import com.example.auth.entity.User;
import com.example.auth.service.UserService;
import com.example.common.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ApiResponse login(@RequestBody User user) {
        // 登录逻辑由Spring Security处理
        return ApiResponse.success("Login successful");
    }

    @PostMapping("/register")
    public ApiResponse register(@RequestBody User user) {
        // 检查用户名是否已存在
        if (userService.getUserByUsername(user.getUsername()) != null) {
            return ApiResponse.fail("Username already exists");
        }

        // 加密密码
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatus(1);

        // 保存用户
        userService.save(user);

        return ApiResponse.success("Registration successful");
    }

    @GetMapping("/info")
    public ApiResponse getInfo(@RequestParam Long userId) {
        User user = userService.getById(userId);
        if (user == null) {
            return ApiResponse.fail("User not found");
        }
        return ApiResponse.success(user);
    }
}