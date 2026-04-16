package com.example.auth.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.auth.entity.User;

import java.util.List;

public interface UserService extends IService<User> {
    User getUserByUsername(String username);
    List<String> getRolesByUserId(Long userId);
    List<String> getPermissionsByUserId(Long userId);
}