package com.example.auth.security;

import com.example.auth.entity.User;
import com.example.auth.service.UserService;
import com.example.common.utils.JwtUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    public JwtAuthenticationFilter(AuthenticationManager authenticationManager, UserService userService) {
        super(authenticationManager);
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        setFilterProcessesUrl("/api/auth/login");
    }
    
    @Override
    public void afterPropertiesSet() {
        // 确保authenticationManager被设置
        super.setAuthenticationManager(authenticationManager);
        super.afterPropertiesSet();
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        try {
            Map<String, String> loginData = new ObjectMapper().readValue(request.getInputStream(), Map.class);
            String username = loginData.get("username");
            String password = loginData.get("password");

            UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(username, password);
            return authenticationManager.authenticate(token);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        String username = authResult.getName();
        User user = userService.getUserByUsername(username);
        String token = JwtUtils.generateToken(user.getId(), username);

        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "Login success");
        result.put("token", token);
        result.put("user", user);

        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(new ObjectMapper().writeValueAsString(result));
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        Map<String, Object> result = new HashMap<>();
        result.put("code", 401);
        result.put("message", "Authentication failed: " + failed.getMessage());

        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(new ObjectMapper().writeValueAsString(result));
    }
}
