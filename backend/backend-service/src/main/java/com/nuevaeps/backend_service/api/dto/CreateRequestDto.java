package com.nuevaeps.backend_service.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record CreateRequestDto(
    @NotNull Long medicationId,
    String orderNumber,
    String address,
    String phone,
    @Email String contactEmail
) {
    
}