package com.service.userauth.service.impl;

import com.service.userauth.dto.request.LoginRequest;
import com.service.userauth.dto.request.RefreshTokenRequest;
import com.service.userauth.dto.request.RegisterRequest;
import com.service.userauth.dto.response.AuthResponse;
import com.service.userauth.dto.response.UserProfileResponse;
import com.service.userauth.dto.response.UserResponse;
import com.service.userauth.entity.*;
import com.service.userauth.exception.EmailAlreadyExistsException;
import com.service.userauth.exception.InvalidTokenException;
import com.service.userauth.exception.ResourceNotFoundException;
import com.service.userauth.repository.*;
import com.service.userauth.security.JwtUtil;
import com.service.userauth.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Value("${jwt.refresh-token.expiration}")
    private long refreshTokenExpiration;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        // Fetch role (default STUDENT unless specified)
        String roleName = (request.getRole() != null) ? request.getRole().toUpperCase() : "STUDENT";
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));

        // Create User
        User user = User.builder()
                .email(request.getEmail())
                .active(true)
                .emailVerified(false)
                .roles(Set.of(role))
                .build();

        // Create AuthCredential
        AuthCredential credential = AuthCredential.builder()
                .user(user)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();
        user.setAuthCredential(credential);

        // Create UserProfile
        UserProfile profile = UserProfile.builder()
                .user(user)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();
        user.setUserProfile(profile);

        userRepository.save(user);
        log.info("Registered new user: {}", request.getEmail());

        return buildAuthResponse(user);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        // Authenticate (throws BadCredentialsException on failure)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        log.info("User logged in: {}", request.getEmail());
        return buildAuthResponse(user);
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new InvalidTokenException("Refresh token not found"));

        if (refreshToken.isRevoked()) {
            throw new InvalidTokenException("Refresh token has been revoked");
        }
        if (refreshToken.isExpired()) {
            throw new InvalidTokenException("Refresh token has expired");
        }

        User user = refreshToken.getUser();
        // Revoke old token
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        log.info("Token refreshed for user: {}", user.getEmail());
        return buildAuthResponse(user);
    }

    @Override
    @Transactional
    public void logout(String refreshTokenValue) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new InvalidTokenException("Refresh token not found"));

        refreshTokenRepository.revokeAllUserTokens(refreshToken.getUser());
        log.info("User logged out — all tokens revoked for: {}", refreshToken.getUser().getEmail());
    }

    // ===== HELPERS =====

    private AuthResponse buildAuthResponse(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        Map<String, Object> claims = Map.of("roles", List.copyOf(roleNames));
        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), claims);
        String refreshTokenValue = createRefreshToken(user);

        UserProfileResponse profileResponse = null;
        if (user.getUserProfile() != null) {
            UserProfile p = user.getUserProfile();
            profileResponse = UserProfileResponse.builder()
                    .firstName(p.getFirstName())
                    .lastName(p.getLastName())
                    .bio(p.getBio())
                    .avatarUrl(p.getAvatarUrl())
                    .phoneNumber(p.getPhoneNumber())
                    .build();
        }

        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .active(user.isActive())
                .emailVerified(user.isEmailVerified())
                .roles(roleNames)
                .createdAt(user.getCreatedAt())
                .profile(profileResponse)
                .build();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue)
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getAccessTokenExpiration() / 1000)
                .user(userResponse)
                .build();
    }

    private String createRefreshToken(User user) {
        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .revoked(false)
                .expiresAt(LocalDateTime.now().plusSeconds(refreshTokenExpiration / 1000))
                .build();
        refreshTokenRepository.save(refreshToken);
        return refreshToken.getToken();
    }
}
