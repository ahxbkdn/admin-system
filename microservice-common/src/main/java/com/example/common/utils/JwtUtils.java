package com.example.common.utils;

import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 简化版JWT工具类
 */
public class JwtUtils {

    /**
     * 密钥 - 这里使用固定密钥以便演示，实际生产应从配置获取
     */
    private static final String SECRET_KEY = "your-secret-key-for-jwt-token-generation";

    /**
     * 默认过期时间（24小时）
     */
    private static final long DEFAULT_EXPIRATION = 24 * 60 * 60 * 1000;

    /**
     * 生成JWT令牌
     */
    public static String generateToken(Long userId, String username) {
        // 简化实现，实际生产应使用完整的JWT库
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("username", username);
        claims.put("exp", new Date(System.currentTimeMillis() + DEFAULT_EXPIRATION));
        
        // 简化的令牌生成，实际生产应使用完整的JWT签名
        return Base64.getEncoder().encodeToString(claims.toString().getBytes());
    }

    /**
     * 从JWT令牌中获取用户ID
     */
    public static Long getUserIdFromToken(String token) {
        // 简化实现，实际生产应使用完整的JWT库
        return 1L; // 模拟返回用户ID
    }

    /**
     * 从JWT令牌中获取用户名
     */
    public static String getUsernameFromToken(String token) {
        // 简化实现，实际生产应使用完整的JWT库
        return "admin";
    }

    /**
     * 验证JWT令牌是否过期
     */
    public static boolean isTokenExpired(String token) {
        // 简化实现，实际生产应使用完整的JWT库
        return false;
    }
}
