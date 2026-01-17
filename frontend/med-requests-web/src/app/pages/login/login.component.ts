import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  template: `
    <h2>Login</h2>

    <form [formGroup]="form" (ngSubmit)="submit()" class="card">
      <label>Email</label>
      <input formControlName="email" type="email" placeholder="tu@email.com" />

      <label>Password</label>
      <input formControlName="password" type="password" placeholder="******" />

      <button type="submit" [disabled]="form.invalid || loading">
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>

      <p class="error" *ngIf="error">{{ error }}</p>

      <p class="muted">
        ¿No tienes cuenta? <a routerLink="/register">Regístrate</a>
      </p>
    </form>
  `,
  styles: [`
    .card { display:flex; flex-direction:column; gap:8px; max-width: 420px; padding:16px; border:1px solid #e5e5e5; border-radius:12px; }
    input { padding:10px; border-radius:10px; border:1px solid #ddd; }
    button { padding:10px; border-radius:10px; border:none; background:#2563eb; color:white; cursor:pointer; }
    button[disabled] { opacity:.6; cursor:not-allowed; }
    .error { color:#dc2626; margin: 8px 0 0; }
    .muted { color:#666; font-size: 14px; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    const { email, password } = this.form.getRawValue();

    this.auth.login(email!, password!).subscribe({
      next: () => this.router.navigateByUrl('/requests'),
      error: (err) => {
        this.error = err?.error?.message ?? 'Error en login';
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }
}
