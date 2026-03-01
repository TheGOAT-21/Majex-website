import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, catchError, map } from 'rxjs';
import { environment } from '../../environments/environment';

// ── Interfaces ──────────────────────────────────────────────────

export interface SiteAsset {
  id: number;
  key: string;
  category: 'logo' | 'hero' | 'about' | 'services' | 'partner';
  label: string;
  url: string | null;
  alt_text: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface AssetsGrouped {
  logo?: SiteAsset[];
  hero?: SiteAsset[];
  about?: SiteAsset[];
  services?: SiteAsset[];
  partner?: SiteAsset[];
}

// ── Service ─────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class AssetService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/assets`;

  /** Cache en mémoire : évite de re-fetcher à chaque navigation */
  private assetsCache = new BehaviorSubject<AssetsGrouped | null>(null);

  /** Fallbacks locaux si le backend n'est pas encore configuré */
  private fallbacks: Record<string, string> = {
    'logo-main':          'assets/images/logo.png',
    'hero-main':          'assets/images/hero-bg.jpg',
    'about-office':       'assets/images/about-office.jpg',
    'about-team':         'assets/images/about-team.jpg',
    'service-formation':  'assets/images/service-formation.jpg',
    'service-conseil':    'assets/images/service-conseil.jpg',
    'service-recrutement':'assets/images/service-recrutement.jpg',
    'partner-rti':        'assets/images/partners/rti.png',
    'partner-anac':       'assets/images/partners/anac.png',
    'partner-port-abidjan':'assets/images/partners/port-abidjan.png',
    'partner-oscn':       'assets/images/partners/oscn.png',
    'partner-aderiz':     'assets/images/partners/aderiz.png',
    'partner-codival':    'assets/images/partners/codival.png',
    'partner-kaera':      'assets/images/partners/kaera.png',
  };

  // ── Chargement initial ────────────────────────────────────────

  /**
   * Charge tous les assets depuis le backend.
   * À appeler dans AppComponent.ngOnInit() ou APP_INITIALIZER.
   * Utilise le cache si déjà chargé.
   */
  loadAll(): Observable<AssetsGrouped> {
    if (this.assetsCache.value) {
      return of(this.assetsCache.value);
    }

    return this.http.get<{ success: boolean; data: AssetsGrouped }>(`${this.apiUrl}`)
      .pipe(
        map(res => res.data),
        tap(data => this.assetsCache.next(data)),
        catchError(err => {
          console.warn('[AssetService] Backend indisponible, utilisation des assets locaux', err);
          return of({});
        })
      );
  }

  /** Invalide le cache (après upload/modification admin) */
  invalidateCache(): void {
    this.assetsCache.next(null);
  }

  // ── Récupération d'un asset ────────────────────────────────────

  /**
   * Retourne l'URL d'un asset par sa clé.
   * Utilise le cache s'il est disponible, sinon le fallback local.
   *
   * Utilisation dans un composant :
   *   logoUrl = this.assetService.getUrl('logo-main');
   */
  getUrl(key: string): string {
    const cache = this.assetsCache.value;
    if (cache) {
      // Chercher dans toutes les catégories
      for (const category of Object.values(cache)) {
        if (Array.isArray(category)) {
          const asset = category.find((a: SiteAsset) => a.key === key);
          if (asset?.url) return asset.url;
        }
      }
    }
    // Fallback local
    return this.fallbacks[key] ?? 'assets/images/placeholder.png';
  }

  /**
   * Retourne l'objet SiteAsset complet par clé (avec alt_text, etc.)
   */
  getAsset(key: string): SiteAsset | null {
    const cache = this.assetsCache.value;
    if (!cache) return null;

    for (const category of Object.values(cache)) {
      if (Array.isArray(category)) {
        const asset = category.find((a: SiteAsset) => a.key === key);
        if (asset) return asset;
      }
    }
    return null;
  }

  /**
   * Retourne tous les assets d'une catégorie (utile pour les partenaires).
   */
  getByCategory(category: string): SiteAsset[] {
    const cache = this.assetsCache.value;
    if (!cache) return [];
    return (cache as any)[category] ?? [];
  }

  // ── API Admin ─────────────────────────────────────────────────

  /** Liste complète pour l'admin (actifs + inactifs) */
  adminGetAll(): Observable<SiteAsset[]> {
    return this.http.get<{ success: boolean; data: SiteAsset[] }>(
      `${environment.apiUrl}/admin/assets`
    ).pipe(map(res => res.data));
  }

  /** Upload/créer un asset */
  adminCreate(formData: FormData): Observable<SiteAsset> {
    return this.http.post<{ success: boolean; data: SiteAsset }>(
      `${environment.apiUrl}/admin/assets`, formData
    ).pipe(
      map(res => res.data),
      tap(() => this.invalidateCache())
    );
  }

  /** Modifier un asset (avec ou sans nouvelle image) */
  adminUpdate(id: number, formData: FormData): Observable<SiteAsset> {
    formData.append('_method', 'PUT'); // Laravel method spoofing pour multipart
    return this.http.post<{ success: boolean; data: SiteAsset }>(
      `${environment.apiUrl}/admin/assets/${id}`, formData
    ).pipe(
      map(res => res.data),
      tap(() => this.invalidateCache())
    );
  }

  /** Supprimer un asset */
  adminDelete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/assets/${id}`).pipe(
      tap(() => this.invalidateCache())
    );
  }

  /** Activer/désactiver */
  adminToggle(id: number): Observable<SiteAsset> {
    return this.http.patch<{ success: boolean; data: SiteAsset }>(
      `${environment.apiUrl}/admin/assets/${id}/toggle`, {}
    ).pipe(
      map(res => res.data),
      tap(() => this.invalidateCache())
    );
  }

  /** Réordonner */
  adminReorder(items: { id: number; sort_order: number }[]): Observable<void> {
    return this.http.patch<void>(
      `${environment.apiUrl}/admin/assets/reorder`, { items }
    ).pipe(tap(() => this.invalidateCache()));
  }
}
