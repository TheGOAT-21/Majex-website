import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * ====================================================================
 * SERVICE D'AUTHENTIFICATION
 * ====================================================================
 * 
 * CONCEPT CLÉ : Service Angular
 * Un service est une classe qui contient de la logique réutilisable.
 * Le décorateur @Injectable permet d'injecter ce service dans n'importe quel composant.
 * 
 * CONCEPT CLÉ : Observable
 * Un Observable est comme une "promesse améliorée" qui peut émettre plusieurs valeurs.
 * Quand vous faites http.post(), ça retourne un Observable.
 * Vous devez vous "abonner" (.subscribe()) pour recevoir la réponse.
 * 
 * CONCEPT CLÉ : BehaviorSubject
 * C'est un type spécial d'Observable qui garde toujours la dernière valeur émise.
 * Utilisé ici pour partager l'état de connexion entre plusieurs composants.
 */

// Interface TypeScript pour typer nos données
interface User {
  id: number;
  name: string;
  email: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

@Injectable({
  providedIn: 'root'  // Ce service est disponible dans toute l'app
})
export class AuthService {
  private apiUrl = environment.apiUrl;  // URL de base de l'API
  private tokenKey = 'auth_token';      // Clé pour localStorage
  
  /**
   * BehaviorSubject pour partager l'utilisateur connecté
   * Tous les composants peuvent s'abonner pour savoir quand l'user change
   */
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  /**
   * Le constructeur est appelé automatiquement par Angular
   * HttpClient est injecté automatiquement (Dependency Injection)
   */
  constructor(private http: HttpClient) {
    // Au démarrage, vérifier si un token existe déjà
    this.checkAuth();
  }

  /**
   * ====================================================================
   * LOGIN - Se connecter
   * ====================================================================
   * 
   * Comment ça marche :
   * 1. Envoie email + password au backend (POST /api/login)
   * 2. Le backend vérifie et retourne un token
   * 3. On stocke le token dans localStorage
   * 4. On met à jour le currentUserSubject (tous les composants abonnés sont notifiés)
   * 
   * Utilisation dans un composant :
   * 
   * this.authService.login(email, password).subscribe({
   *   next: (response) => {
   *     console.log('Connecté !', response);
   *     this.router.navigate(['/admin']);
   *   },
   *   error: (err) => {
   *     console.error('Erreur de login', err);
   *   }
   * });
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      email,
      password
    }).pipe(
      // tap() permet d'exécuter du code sans modifier la réponse
      tap(response => {
        if (response.success) {
          // Stocker le token dans le navigateur
          localStorage.setItem(this.tokenKey, response.data.token);
          
          // Notifier tous les composants qu'un user est connecté
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  /**
   * ====================================================================
   * LOGOUT - Se déconnecter
   * ====================================================================
   */
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        // Supprimer le token
        localStorage.removeItem(this.tokenKey);
        
        // Notifier que plus personne n'est connecté
        this.currentUserSubject.next(null);
      })
    );
  }

  /**
   * ====================================================================
   * GETTERS - Méthodes utilitaires
   * ====================================================================
   */
  
  /**
   * Récupérer le token stocké
   * Utilisé par l'interceptor pour l'ajouter automatiquement aux requêtes
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Vérifier si quelqu'un est connecté
   * Utilisé par les guards de route pour protéger les pages admin
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Récupérer l'utilisateur actuel (synchrone)
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * ====================================================================
   * MÉTHODES PRIVÉES
   * ====================================================================
   */

  /**
   * Vérifier l'authentification au démarrage de l'app
   * Si un token existe, on récupère les infos de l'utilisateur
   */
  private checkAuth(): void {
    if (this.isAuthenticated()) {
      // Demander au backend qui est connecté
      this.http.get<any>(`${this.apiUrl}/user`).subscribe({
        next: (response) => {
          this.currentUserSubject.next(response.data);
        },
        error: () => {
          // Token invalide ou expiré, on le supprime
          localStorage.removeItem(this.tokenKey);
        }
      });
    }
  }
}

/**
 * ====================================================================
 * COMMENT UTILISER CE SERVICE DANS UN COMPOSANT
 * ====================================================================
 * 
 * 1. IMPORTER LE SERVICE
 * 
 * import { AuthService } from './services/auth.service';
 * 
 * 2. L'INJECTER DANS LE CONSTRUCTEUR
 * 
 * constructor(private authService: AuthService) {}
 * 
 * 3. L'UTILISER
 * 
 * // Se connecter
 * onLogin() {
 *   this.authService.login(this.email, this.password).subscribe({
 *     next: (response) => {
 *       console.log('Connecté !', response);
 *     },
 *     error: (error) => {
 *       console.error('Erreur', error);
 *     }
 *   });
 * }
 * 
 * // Vérifier si connecté
 * isLoggedIn(): boolean {
 *   return this.authService.isAuthenticated();
 * }
 * 
 * // Observer l'utilisateur connecté
 * ngOnInit() {
 *   this.authService.currentUser$.subscribe(user => {
 *     console.log('Utilisateur actuel:', user);
 *   });
 * }
 * 
 * ====================================================================
 */
