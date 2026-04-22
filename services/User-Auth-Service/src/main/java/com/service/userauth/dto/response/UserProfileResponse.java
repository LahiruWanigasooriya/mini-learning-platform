package com.service.userauth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private String firstName;
    private String lastName;
    private String bio;
    private String avatarUrl;
    private String phoneNumber;
}
