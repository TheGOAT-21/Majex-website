import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject, Observable, of, tap, catchError,
  map, distinctUntilChanged, shareReplay, take
} from 'rxjs';
import { environment } from '../../environments/environment';

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

@Injectable({ providedIn: 'root' })
export class AssetService {
  private http = inject(HttpClient);

  private baseUrl   = `${environment.apiUrl}/api`;
  private publicUrl = `${this.baseUrl}/assets`;
  private adminUrl  = `${this.baseUrl}/admin/assets`;

  // ── Fallbacks locaux (disponibles immédiatement, zéro latence) ──────────
  private fallbacks: Record<string, string> = {
    'logo-main':            'assets/logos/0-removebg-preview 1.png',
    'logo-fdfp':            'assets/logos/fdfp.png',
    'logo-metfpa':          'assets/logos/Logo-METFPA-2.png',
    'hero-main':            'assets/images/pic4.jpg',
    'about-office':         'assets/images/pic7.jpg',
    'about-team':           'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80',
    'service-formation':    'assets/images/pic5.jpg',
    'service-conseil':      'assets/images/pic8.jpg',
    'service-recrutement':  'assets/images/pic6.jpg',
    'partner-rti':          'assets/partenaire_logos/RTI.webp',
    'partner-anac':         'assets/partenaire_logos/ANAC.png',
    'partner-port-abidjan': 'assets/partenaire_logos/Port Autonome Abidjan.png',
    'partner-oscn':         'assets/partenaire_logos/OSCN.png',
    'partner-aderiz':       'assets/partenaire_logos/ADERIZ.png',
    'partner-codival':      'assets/partenaire_logos/codival.svg',
    'partner-kaera':        'assets/partenaire_logos/Kaera.svg',
  };

  // ── État réactif central ─────────────────────────────────────────────────
  // Démarre avec null → les composants utilisent les fallbacks en attendant
  private cache$ = new BehaviorSubject<AssetsGrouped | null>(null);
  private loadRequest$: Observable<AssetsGrouped> | null = null;
  private loaded = false;

  // ── Observable public sur lequel les composants peuvent s'abonner ────────
  // Émet chaque fois que le cache change (fallback → backend)
  readonly assets$: Observable<AssetsGrouped> = this.cache$.pipe(
    map(cache => cache ?? {}),
    distinctUntilChanged(),
    shareReplay(1)
  );

  // ── Chargement depuis le backend (appelé une seule fois) ─────────────────
  loadAll(): Observable<AssetsGrouped> {
    if (this.loaded && this.cache$.value !== null) {
      return of(this.cache$.value);
    }
    if (this.loadRequest$) {
      return this.loadRequest$; // Requête déjà en cours, on la réutilise
    }

    this.loaded = true;
    this.loadRequest$ = this.http
      .get<{ success: boolean; data: AssetsGrouped }>(this.publicUrl)
      .pipe(
        map(res => res.data),
        catchError(err => {
          console.warn('[AssetService] Backend indisponible, fallbacks locaux utilisés.', err);
          return of({} as AssetsGrouped); // Pas de crash : les fallbacks prennent le relais
        }),
        tap(data => {
          this.cache$.next(data);
          this.loadRequest$ = null;
        }),
        shareReplay(1)
      );

    return this.loadRequest$;
  }

  invalidateCache(): void {
    this.loaded = false;
    this.loadRequest$ = null;
    this.cache$.next(null);
  }

  // ── Observable par clé (pour les composants OnPush avec async pipe) ──────
  // Émet immédiatement le fallback, puis l'URL du backend quand disponible
  getUrl$(key: string): Observable<string> {
    return this.cache$.pipe(
      map(cache => this.resolveKey(key, cache)),
      distinctUntilChanged() // Évite les re-renders inutiles si la valeur ne change pas
    );
  }

  // Observable pour un asset complet (alt_text, etc.)
  getAsset$(key: string): Observable<SiteAsset | null> {
    return this.cache$.pipe(
      map(cache => this.findAsset(key, cache)),
      distinctUntilChanged((a, b) => a?.url === b?.url)
    );
  }

  // Observable pour une catégorie entière
  getByCategory$(category: string): Observable<SiteAsset[]> {
    return this.cache$.pipe(
      map(cache => cache ? ((cache as any)[category] ?? []) : []),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    );
  }

  // ── Getters synchrones (compatibilité avec le code existant) ─────────────
  // Retournent le fallback immédiatement si le cache n'est pas prêt
  getUrl(key: string): string {
    return this.resolveKey(key, this.cache$.value);
  }

  getAsset(key: string): SiteAsset | null {
    return this.findAsset(key, this.cache$.value);
  }

  getByCategory(category: string): SiteAsset[] {
    const cache = this.cache$.value;
    if (!cache) return [];
    return (cache as any)[category] ?? [];
  }

  // ── Helpers privés ───────────────────────────────────────────────────────
  private resolveKey(key: string, cache: AssetsGrouped | null): string {
    if (cache) {
      const asset = this.findAsset(key, cache);
      if (asset?.url && asset.is_active) return this.resolveUrl(asset.url);
    }
    return this.fallbacks[key] ?? ''; // Fallback immédiat si pas de backend
  }

  private findAsset(key: string, cache: AssetsGrouped | null): SiteAsset | null {
    if (!cache) return null;
    for (const category of Object.values(cache)) {
      if (Array.isArray(category)) {
        const asset = category.find((a: SiteAsset) => a.key === key);
        if (asset) return asset;
      }
    }
    return null;
  }

  private resolveUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `${environment.apiUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  // ── API Admin ────────────────────────────────────────────────────────────
  adminGetAll(): Observable<SiteAsset[]> {
    return this.http.get<{ success: boolean; data: SiteAsset[] }>(this.adminUrl)
      .pipe(map(res => res.data));
  }

  adminCreate(formData: FormData): Observable<SiteAsset> {
    return this.http.post<{ success: boolean; data: SiteAsset }>(this.adminUrl, formData)
      .pipe(map(res => res.data), tap(() => this.invalidateCache()));
  }

  adminUpdate(id: number, formData: FormData): Observable<SiteAsset> {
    formData.append('_method', 'PUT');
    return this.http.post<{ success: boolean; data: SiteAsset }>(`${this.adminUrl}/${id}`, formData)
      .pipe(map(res => res.data), tap(() => this.invalidateCache()));
  }

  adminDelete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${id}`)
      .pipe(tap(() => this.invalidateCache()));
  }

  adminToggle(id: number): Observable<SiteAsset> {
    return this.http.patch<{ success: boolean; data: SiteAsset }>(`${this.adminUrl}/${id}/toggle`, {})
      .pipe(map(res => res.data), tap(() => this.invalidateCache()));
  }

  adminReorder(items: { id: number; sort_order: number }[]): Observable<void> {
    return this.http.patch<void>(`${this.adminUrl}/reorder`, { items })
      .pipe(tap(() => this.invalidateCache()));
  }
}