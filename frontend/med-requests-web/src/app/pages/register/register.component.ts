import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  template: `
    <h2>Registro</h2>

    <form [formGroup]="form" (ngSubmit)="submit()" class="card">
      <label>Nombre</label>
      <input formControlName="fullName" type="text" placeholder="Tu nombre" />

      <label>Email</label>
      <input formControlName="email" type="email" placeholder="tu@email.com" />

      <label>Password</label>
      <input formControlName="password" type="password" placeholder="mínimo 6" />

      <button type="submit" [disabled]="form.invalid || loading">
        {{ loading ? 'Creando...' : 'Crear cuenta' }}
      </button>

      <p class="error" *ngIf="error">{{ error }}</p>

      <p class="muted">
        ¿Ya tienes cuenta? <a routerLink="/login">Login</a>
      </p>
    </form>
  `,
  styles: [`
    .card { display:flex; flex-direction:column; gap:8px; max-width: 420px; padding:16px; border:1px solid #e5e5e5; border-radius:12px; }
    input { padding:10px; border-radius:10px; border:1px solid #ddd; }
    button { padding:10px; border-radius:10px; border:none; background:#16a34a; color:white; cursor:pointer; }
    button[disabled] { opacity:.6; cursor:not-allowed; }
    .error { color:#dc2626; margin: 8px 0 0; }
    .muted { color:#666; font-size: 14px; }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    const { fullName, email, password } = this.form.getRawValue();

    this.auth.register(fullName!, email!, password!).subscribe({
      next: () => this.router.navigateByUrl('/requests'),
      error: (err) => {
        this.error = err?.error?.message ?? 'Error en registro';
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }
}
