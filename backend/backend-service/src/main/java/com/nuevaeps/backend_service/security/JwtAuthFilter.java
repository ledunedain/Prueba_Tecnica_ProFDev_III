package com.nuevaeps.backend_service.security;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

  private final SecretKey key;
  private final String issuer;

  public JwtAuthFilter(
      @Value("${app.jwt.secret}") String secret,
      @Value("${app.jwt.issuer}") String issuer
  ) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.issuer = issuer;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    String auth = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (auth == null || !auth.startsWith("Bearer ")) {
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing token");
      return;
    }

    String token = auth.substring("Bearer ".length()).trim();

    try {
      Jws<Claims> parsed = Jwts.parser()
          .verifyWith(key)
          .requireIssuer(issuer)
          .build()
          .parseSignedClaims(token);

      Object uid = parsed.getPayload().get("uid");
      if (uid == null) {
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
        return;
      }

      Long userId = (uid instanceof Integer i) ? i.longValue()
          : (uid instanceof Long l) ? l
          : Long.valueOf(uid.toString());

      var authentication =
          new UsernamePasswordAuthenticationToken(userId, null, List.of());
      SecurityContextHolder.getContext().setAuthentication(authentication);

      request.setAttribute("userId", userId);

      filterChain.doFilter(request, response);
    } catch (JwtException ex) {
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
    }
  }
}