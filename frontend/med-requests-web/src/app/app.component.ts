import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from './core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf],
  template: `
    <div class="container">
      <header class="topbar">
        <a routerLink="/requests" class="brand">Med Requests</a>

        <nav class="nav">
          <a routerLink="/requests" *ngIf="loggedIn()">Solicitudes</a>
          <a routerLink="/requests/new" *ngIf="loggedIn()">Nueva</a>
          <a routerLink="/login" *ngIf="!loggedIn()">Login</a>
          <a routerLink="/register" *ngIf="!loggedIn()">Registro</a>

          <button class="link" *ngIf="loggedIn()" (click)="logout()">Salir</button>
        </nav>
      </header>

      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .container { max-width: 980px; margin: 0 auto; padding: 16px; font-family: system-ui, Arial; }
    .topbar { display:flex; justify-content:space-between; align-items:center; padding: 8px 0; border-bottom: 1px solid #e5e5e5; }
    .brand { font-weight: 700; text-decoration:none; color:#111; }
    .nav { display:flex; gap:12px; align-items:center; }
    a { text-decoration:none; color:#2563eb; }
    .link { background:none; border:none; color:#ef4444; cursor:pointer; padding:0; }
    .content { padding-top: 16px; }
  `]
})
export class AppComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  loggedIn = computed(() => this.auth.isLoggedIn());

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
