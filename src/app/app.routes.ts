import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    // Route secrète pour la connexion admin
    path: 'mjx-admin-login-secure-2025',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    // Route secrète pour le panneau d'administration
    path: 'mjx-admin-dashboard-secure-2025',
    loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
