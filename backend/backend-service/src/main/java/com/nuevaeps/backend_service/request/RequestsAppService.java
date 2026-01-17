package com.nuevaeps.backend_service.request;

import java.time.format.DateTimeFormatter;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.nuevaeps.backend_service.api.BadRequestException;
import com.nuevaeps.backend_service.api.dto.CreateRequestDto;
import com.nuevaeps.backend_service.api.dto.RequestListItemDto;
import com.nuevaeps.backend_service.medication.MedicationEntity;
import com.nuevaeps.backend_service.medication.MedicationRepository;

@Service
public class RequestsAppService {

  private final MedicationRepository medRepo;
  private final RequestRepository reqRepo;

  public RequestsAppService(MedicationRepository medRepo, RequestRepository reqRepo) {
    this.medRepo = medRepo;
    this.reqRepo = reqRepo;
  }

  public void create(Long userId, CreateRequestDto dto) {
    MedicationEntity med = medRepo.findById(dto.medicationId())
        .orElseThrow(() -> new BadRequestException("Medicamento no existe"));

    if (med.isNoPos()) {
      require(dto.orderNumber(), "orderNumber");
      require(dto.address(), "address");
      require(dto.phone(), "phone");
      require(dto.contactEmail(), "contactEmail");
    }

    RequestEntity r = new RequestEntity();
    r.setUserId(userId);
    r.setMedicationId(med.getId());
    r.setOrderNumber(trimOrNull(dto.orderNumber()));
    r.setAddress(trimOrNull(dto.address()));
    r.setPhone(trimOrNull(dto.phone()));
    r.setContactEmail(trimOrNull(dto.contactEmail()));
    reqRepo.save(r);
  }

  public Page<RequestListItemDto> list(Long userId, int page, int size) {
    Page<RequestEntity> data = reqRepo.findByUserIdOrderByCreatedAtDesc(
        userId, PageRequest.of(page, size)
    );

    return data.map(r -> {
      MedicationEntity med = medRepo.findById(r.getMedicationId()).orElse(null);
      String name = med != null ? med.getName() : "N/A";
      boolean noPos = med != null && med.isNoPos();

      return new RequestListItemDto(
          r.getId(),
          name,
          noPos,
          DateTimeFormatter.ISO_INSTANT.format(r.getCreatedAt()),
          r.getOrderNumber(),
          r.getAddress(),
          r.getPhone(),
          r.getContactEmail()
      );
    });
  }

  private static void require(String v, String field) {
    if (!StringUtils.hasText(v)) {
      throw new BadRequestException("Campo obligatorio para NO POS: " + field);
    }
  }

  private static String trimOrNull(String s) {
    return StringUtils.hasText(s) ? s.trim() : null;
  }
}
