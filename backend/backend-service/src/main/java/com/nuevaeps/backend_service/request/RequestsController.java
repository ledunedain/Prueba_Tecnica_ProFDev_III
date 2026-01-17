package com.nuevaeps.backend_service.request;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.nuevaeps.backend_service.api.dto.CreateRequestDto;
import com.nuevaeps.backend_service.api.dto.RequestListItemDto;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/requests")
public class RequestsController {

  private final RequestsAppService service;

  public RequestsController(RequestsAppService service) {
    this.service = service;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public void create(@RequestAttribute("userId") Long userId,
                     @Valid @RequestBody CreateRequestDto dto) {
    service.create(userId, dto);
  }

  @GetMapping
  public Page<RequestListItemDto> list(@RequestAttribute("userId") Long userId,
                                      @RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "10") int size) {
    return service.list(userId, page, size);
  }
}
