import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { NewRequestComponent } from './pages/new-request/new-request.component';
import { RequestsListComponent } from './pages/requests-list/requests-list.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'requests' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'requests', component: RequestsListComponent, canActivate: [authGuard] },
  { path: 'requests/new', component: NewRequestComponent, canActivate: [authGuard] },
];
