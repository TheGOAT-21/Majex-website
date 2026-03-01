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

  /**
   * Fallbacks vers les fichiers statiques Angular existants.
   * Utilisés tant que l'image n'a pas été uploadée côté backend.
   */
  private fallbacks: Record<string, string> = {
    // Logos
    'logo-main':           'assets/logos/0-removebg-preview 1.png',
    'logo-fdfp':           'assets/logos/fdfp.png',
    'logo-metfpa':         'assets/logos/Logo-METFPA-2.png',

    // Héro
    'hero-main':           'assets/images/pic4.jpg',

    // About
    'about-office':        'assets/images/pic7.jpg',
    'about-team':          'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',

    // Services
    'service-formation':   'assets/images/pic5.jpg',
    'service-conseil':     'assets/images/pic8.jpg',
    'service-recrutement': 'assets/images/pic6.jpg',

    // Partenaires
    'partner-rti':          'assets/partenaire_logos/RTI.webp',
    'partner-anac':         'assets/partenaire_logos/ANAC.png',
    'partner-port-abidjan': 'assets/partenaire_logos/Port Autonome Abidjan.png',
    'partner-oscn':         'assets/partenaire_logos/OSCN.png',
    'partner-aderiz':       'assets/partenaire_logos/ADERIZ.png',
    'partner-codival':      'assets/partenaire_logos/codival.svg',
    'partner-kaera':        'assets/partenaire_logos/Kaera.svg',
  };

  // ── Chargement initial ────────────────────────────────────────

  /**
   * Charge tous les assets depuis le backend.
   * À appeler via provideAppInitializer() dans app.config.ts.
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
   * Priorité : backend (cache) → url Unsplash stockée → fallback local.
   */
  getUrl(key: string): string {
    const cache = this.assetsCache.value;
    if (cache) {
      for (const category of Object.values(cache)) {
        if (Array.isArray(category)) {
          const asset = category.find((a: SiteAsset) => a.key === key);
          if (asset?.url) return asset.url;
        }
      }
    }
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
   * Retourne tous les assets actifs d'une catégorie, triés par sort_order.
   * Utilisé pour les partenaires (liste dynamique).
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
    formData.append('_method', 'PUT');
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