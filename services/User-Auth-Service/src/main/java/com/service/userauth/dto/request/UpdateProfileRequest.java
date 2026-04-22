package com.service.userauth.dto.request;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private String bio;
    private String avatarUrl;
    private String phoneNumber;
}
