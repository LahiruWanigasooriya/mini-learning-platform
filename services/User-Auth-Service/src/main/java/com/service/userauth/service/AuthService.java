package com.service.userauth.service;

import com.service.userauth.dto.request.LoginRequest;
import com.service.userauth.dto.request.RefreshTokenRequest;
import com.service.userauth.dto.request.RegisterRequest;
import com.service.userauth.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
    void logout(String refreshToken);
}
