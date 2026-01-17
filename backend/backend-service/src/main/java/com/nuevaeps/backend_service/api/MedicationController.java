package com.nuevaeps.backend_service.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nuevaeps.backend_service.api.dto.MedicationDto;
import com.nuevaeps.backend_service.medication.MedicationRepository;

@RestController
@RequestMapping("/medications")
public class MedicationController {

  private final MedicationRepository repo;

  public MedicationController(MedicationRepository repo) {
    this.repo = repo;
  }

  @GetMapping
  public List<MedicationDto> list() {
    return repo.findAll().stream()
        .map(m -> new MedicationDto(m.getId(), m.getName(), m.isNoPos()))
        .toList();
  }
}