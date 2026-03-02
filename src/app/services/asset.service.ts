import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, catchError, map, filter, take } from 'rxjs';
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

  // null = pas encore chargé, {} = chargé (même si vide/erreur)
  private assetsCache$ = new BehaviorSubject<AssetsGrouped | null>(null);
  private loaded = false;

  private fallbacks: Record<string, string> = {
    'logo-main':            'assets/logos/0-removebg-preview 1.png',
    'logo-fdfp':            'assets/logos/fdfp.png',
    'logo-metfpa':          'assets/logos/Logo-METFPA-2.png',
    'hero-main':            'assets/images/pic4.jpg',
    'about-office':         'assets/images/pic7.jpg',
    'about-team':           'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
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

  // ── Chargement initial (à appeler UNE seule fois au démarrage) ──

  loadAll(): Observable<AssetsGrouped> {
    if (this.loaded) {
      return of(this.assetsCache$.value ?? {});
    }
    this.loaded = true;

    return this.http.get<{ success: boolean; data: AssetsGrouped }>(this.publicUrl).pipe(
      map(res => res.data),
      catchError(err => {
        console.warn('[AssetService] Backend indisponible, utilisation des assets locaux', err);
        return of({} as AssetsGrouped);
      }),
      tap(data => this.assetsCache$.next(data))
    );
  }

  /** Observable qui émet UNE FOIS quand le cache est prêt */
  whenReady(): Observable<AssetsGrouped> {
    return this.assetsCache$.pipe(
      filter(cache => cache !== null),
      take(1),
      map(cache => cache as AssetsGrouped)
    );
  }

  invalidateCache(): void {
    this.loaded = false;
    this.assetsCache$.next(null);
  }

  // ── Récupération synchrone (depuis le cache) ──────────────────

  getUrl(key: string): string {
    const cache = this.assetsCache$.value;
    if (cache) {
      for (const category of Object.values(cache)) {
        if (Array.isArray(category)) {
          const asset = category.find((a: SiteAsset) => a.key === key);
          if (asset?.url) return this.resolveUrl(asset.url);
        }
      }
    }
    return this.fallbacks[key] ?? '';
  }

  getAsset(key: string): SiteAsset | null {
    const cache = this.assetsCache$.value;
    if (!cache) return null;
    for (const category of Object.values(cache)) {
      if (Array.isArray(category)) {
        const asset = category.find((a: SiteAsset) => a.key === key);
        if (asset) return asset;
      }
    }
    return null;
  }

  getByCategory(category: string): SiteAsset[] {
    const cache = this.assetsCache$.value;
    if (!cache) return [];
    return (cache as any)[category] ?? [];
  }

  private resolveUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `${environment.apiUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  // ── API Admin ─────────────────────────────────────────────────

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