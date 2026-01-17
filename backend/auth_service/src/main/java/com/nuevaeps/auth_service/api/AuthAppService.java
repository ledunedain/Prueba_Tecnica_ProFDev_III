package com.nuevaeps.auth_service.api;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nuevaeps.auth_service.api.dto.AuthResponse;
import com.nuevaeps.auth_service.api.dto.LoginRequest;
import com.nuevaeps.auth_service.api.dto.RegisterRequest;
import com.nuevaeps.auth_service.security.JwtService;
import com.nuevaeps.auth_service.user.UserEntity;
import com.nuevaeps.auth_service.user.UserRepository;

@Service
public class AuthAppService {

  private final UserRepository userRepo;
  private final PasswordEncoder encoder;
  private final JwtService jwtService;

  public AuthAppService(UserRepository userRepo, PasswordEncoder encoder, JwtService jwtService) {
    this.userRepo = userRepo;
    this.encoder = encoder;
    this.jwtService = jwtService;
  }

  public AuthResponse register(RegisterRequest req) {
    String email = req.email().trim().toLowerCase();

    if (userRepo.existsByEmail(email)) {
      throw new BadRequestException("Email ya registrado");
    }

    UserEntity u = new UserEntity();
    u.setFullName(req.fullName().trim());
    u.setEmail(email);
    u.setPasswordHash(encoder.encode(req.password()));

    UserEntity saved = userRepo.save(u);
    return new AuthResponse(jwtService.generateToken(saved.getId(), saved.getEmail()));
  }

  public AuthResponse login(LoginRequest req) {
    String email = req.email().trim().toLowerCase();

    UserEntity u = userRepo.findByEmail(email)
        .orElseThrow(() -> new UnauthorizedException("Credenciales inválidas"));

    if (!encoder.matches(req.password(), u.getPasswordHash())) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    return new AuthResponse(jwtService.generateToken(u.getId(), u.getEmail()));
  }
}