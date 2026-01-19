import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-majex-gray-50 flex items-center justify-center">
      <div class="text-center">
        <img src="assets/logos/0-removebg-preview 1.png" alt="MAJEX CONSULTING" class="h-32 mx-auto mb-8">
        <h1 class="text-4xl font-bold text-majex-secondary mb-4">MAJEX CONSULTING</h1>
        <p class="text-xl text-majex-gray-600 mb-8">Conseil en Management et Stratégie d'Entreprise</p>
        <div class="space-x-4">
          <a routerLink="/login" class="btn-majex-primary hover-majex-primary px-8 py-3 inline-block">
            Connexion Admin
          </a>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}
