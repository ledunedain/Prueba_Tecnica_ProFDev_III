import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly key = 'token';
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  get token(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.key);
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  register(fullName: string, email: string, password: string) {
    return this.http
      .post<{ token: string }>(`${environment.authApi}/auth/register`, { fullName, email, password })
      .pipe(tap(res => {
        if (this.isBrowser) localStorage.setItem(this.key, res.token);
      }));
  }

  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>(`${environment.authApi}/auth/login`, { email, password })
      .pipe(tap(res => {
        if (this.isBrowser) localStorage.setItem(this.key, res.token);
      }));
  }

  logout() {
    if (this.isBrowser) localStorage.removeItem(this.key);
  }
}
