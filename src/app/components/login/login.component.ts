import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Étape 1 : Email + Password
  email = '';
  password = '';

  // Étape 2 : Code 2FA
  code = '';
  showCodeInput = false;

  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.two_factor) {
          // Code envoyé par email, afficher l'input du code
          this.showCodeInput = true;
          this.errorMessage = '';
        }
        this.loading = false;
      },
      error: (error) => {
        const errors = error.error?.errors;
        this.errorMessage = errors?.email?.[0] || error.error?.message || 'Identifiants incorrects';
        this.loading = false;
      }
    });
  }

  onVerifyCode(): void {
    if (!this.code || this.code.length !== 6) {
      this.errorMessage = 'Veuillez saisir le code à 6 chiffres';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.verifyCode(this.email, this.code).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/mjx-admin-dashboard-secure-2025']);
        } else {
          this.errorMessage = response.message || 'Code invalide ou expiré';
          this.loading = false;
          this.code = '';
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Code invalide ou expiré';
        this.loading = false;
        this.code = '';
      }
    });
  }

  resendCode(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.errorMessage = '';
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du renvoi du code';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.showCodeInput = false;
    this.code = '';
    this.password = '';
    this.errorMessage = '';
  }
}