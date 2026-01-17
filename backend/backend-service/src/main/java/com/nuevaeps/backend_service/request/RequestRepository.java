package com.nuevaeps.backend_service.request;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestRepository extends JpaRepository<RequestEntity, Long> {
  Page<RequestEntity> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}
