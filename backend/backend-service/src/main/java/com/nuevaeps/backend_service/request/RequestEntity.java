package com.nuevaeps.backend_service.request;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "requests")
public class RequestEntity {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "medication_id", nullable = false)
  private Long medicationId;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt = Instant.now();

  @Column(name = "order_number", length = 50)
  private String orderNumber;

  @Column(length = 200)
  private String address;

  @Column(length = 30)
  private String phone;

  @Column(name = "contact_email", length = 120)
  private String contactEmail;
}
