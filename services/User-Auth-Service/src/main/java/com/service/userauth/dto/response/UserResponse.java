package com.service.userauth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private boolean active;
    private boolean emailVerified;
    private Set<String> roles;
    private LocalDateTime createdAt;
    private UserProfileResponse profile;
}
