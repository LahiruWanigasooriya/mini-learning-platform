package com.service.userauth.service;

import com.service.userauth.dto.request.UpdateProfileRequest;
import com.service.userauth.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse getCurrentUser(String email);
    UserResponse getUserById(Long id);
    UserResponse updateProfile(String email, UpdateProfileRequest request);
    List<UserResponse> getAllUsers();
    void assignRole(Long userId, String roleName);
    void deactivateUser(Long userId);
}
