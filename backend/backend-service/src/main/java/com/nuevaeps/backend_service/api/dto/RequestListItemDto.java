package com.nuevaeps.backend_service.api.dto;

public record RequestListItemDto(
    Long id,
    String medicationName,
    boolean noPos,
    String createdAt,
    String orderNumber,
    String address,
    String phone,
    String contactEmail
) {
    
}