import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

/**
 * ====================================================================
 * HTTP INTERCEPTOR - Intercepteur de requêtes HTTP
 * ====================================================================
 * 
 * CONCEPT CLÉ : Interceptor
 * Un interceptor "intercepte" toutes les requêtes HTTP avant qu'elles partent
 * et toutes les réponses avant qu'elles arrivent au composant.
 * 
 * Cas d'usage :
 * - Ajouter automatiquement le token d'authentification à toutes les requêtes
 * - Gérer les erreurs globalement (ex: rediriger vers /login si 401)
 * - Logger toutes les requêtes
 * - Afficher/masquer un loader global
 * 
 * AVANTAGE :
 * Vous n'avez plus besoin d'ajouter manuellement le token dans chaque requête !
 * L'interceptor le fait automatiquement pour toutes les requêtes.
 */

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Méthode principale appelée pour chaque requête HTTP
   * 
   * @param request - La requête HTTP sortante
   * @param next - Le handler qui envoie la requête
   * @returns Observable de la réponse
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    // 1. AJOUTER LE TOKEN À LA REQUÊTE
    // Récupérer le token du service d'authentification
    const token = this.authService.getToken();

    // Si un token existe, cloner la requête et ajouter le header Authorization
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // 2. ENVOYER LA REQUÊTE ET GÉRER LES ERREURS
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        
        // Si erreur 401 (Unauthorized) = Token invalide ou expiré
        if (error.status === 401) {
          // Déconnecter l'utilisateur
          this.authService.logout().subscribe();
          
          // Rediriger vers la page de login
          this.router.navigate(['/login']);
        }

        // Si erreur 403 (Forbidden) = Accès refusé
        if (error.status === 403) {
          console.error('Accès refusé');
        }

        // Si erreur 500 (Server Error)
        if (error.status === 500) {
          console.error('Erreur serveur');
        }

        // Propager l'erreur pour que le composant puisse la gérer
        return throwError(() => error);
      })
    );
  }
}

/**
 * ====================================================================
 * COMMENT ENREGISTRER CET INTERCEPTOR
 * ====================================================================
 * 
 * Angular 14+ (standalone components) :
 * Dans app.config.ts ou main.ts :
 * 
 * import { provideHttpClient, withInterceptors } from '@angular/common/http';
 * import { AuthInterceptor } from './interceptors/auth.interceptor';
 * 
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(
 *       withInterceptors([AuthInterceptor])
 *     )
 *   ]
 * };
 * 
 * OU
 * 
 * Angular avec modules (app.module.ts) :
 * 
 * import { HTTP_INTERCEPTORS } from '@angular/common/http';
 * import { AuthInterceptor } from './interceptors/auth.interceptor';
 * 
 * @NgModule({
 *   providers: [
 *     {
 *       provide: HTTP_INTERCEPTORS,
 *       useClass: AuthInterceptor,
 *       multi: true  // Important ! Permet d'avoir plusieurs interceptors
 *     }
 *   ]
 * })
 * 
 * ====================================================================
 */
