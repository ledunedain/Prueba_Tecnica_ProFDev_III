package com.nuevaeps.auth_service.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank @Size(max = 120) String fullName,
    @NotBlank @Email @Size(max = 120) String email,
    @NotBlank @Size(min = 6, max = 72) String password
) {
    
}
