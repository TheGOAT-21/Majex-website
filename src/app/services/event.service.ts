import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * ====================================================================
 * SERVICE ÉVÉNEMENTS
 * ====================================================================
 * 
 * Ce service gère toutes les opérations CRUD sur les événements :
 * - GET /api/events → Lister les événements
 * - GET /api/events/{id} → Détails d'un événement
 * - POST /api/events → Créer (protégé)
 * - PUT /api/events/{id} → Modifier (protégé)
 * - DELETE /api/events/{id} → Supprimer (protégé)
 */

// Interface TypeScript pour les événements
export interface Event {
  id: number;
  title: string;
  description: string;
  type: 'ceremonie' | 'formation' | 'seminaire' | 'conference';
  date: string;
  end_date?: string;
  location: string;
  max_participants?: number;
  current_participants: number;
  price?: number;
  image_url?: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  is_full: boolean;
  spots_available?: number;
  is_past: boolean;
  formatted_price: string;
  created_at: string;
  updated_at: string;
}

interface EventsResponse {
  success: boolean;
  data: {
    data: Event[];
    current_page: number;
    last_page: number;
    total: number;
  };
}

interface EventResponse {
  success: boolean;
  data: Event;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  /**
   * ====================================================================
   * GET ALL EVENTS - Récupérer tous les événements (PUBLIC)
   * ====================================================================
   * 
   * Utilisation dans un composant :
   * 
   * this.eventService.getEvents().subscribe({
   *   next: (response) => {
   *     this.events = response.data.data;
   *   }
   * });
   * 
   * Avec filtres :
   * 
   * this.eventService.getEvents({ type: 'formation', upcoming: true }).subscribe(...);
   */
  getEvents(filters?: {
    type?: string;
    status?: string;
    upcoming?: boolean;
  }): Observable<EventsResponse> {
    // HttpParams permet de construire les query parameters
    let params = new HttpParams();
    
    if (filters?.type) {
      params = params.set('type', filters.type);
    }
    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    if (filters?.upcoming !== undefined) {
      params = params.set('upcoming', filters.upcoming.toString());
    }

    return this.http.get<EventsResponse>(this.apiUrl, { params });
  }

  /**
   * ====================================================================
   * GET ONE EVENT - Récupérer un événement par ID (PUBLIC)
   * ====================================================================
   */
  getEvent(id: number): Observable<EventResponse> {
    return this.http.get<EventResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * ====================================================================
   * CREATE EVENT - Créer un événement (PROTÉGÉ)
   * ====================================================================
   * 
   * Nécessite d'être connecté (le token sera ajouté automatiquement par l'interceptor)
   */
  createEvent(event: Partial<Event>): Observable<EventResponse> {
    return this.http.post<EventResponse>(this.apiUrl, event);
  }

  /**
   * ====================================================================
   * UPDATE EVENT - Modifier un événement (PROTÉGÉ)
   * ====================================================================
   */
  updateEvent(id: number, event: Partial<Event>): Observable<EventResponse> {
    return this.http.put<EventResponse>(`${this.apiUrl}/${id}`, event);
  }

  /**
   * ====================================================================
   * DELETE EVENT - Supprimer un événement (PROTÉGÉ)
   * ====================================================================
   */
  deleteEvent(id: number): Observable<EventResponse> {
    return this.http.delete<EventResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * ====================================================================
   * PUBLISH EVENT - Publier un événement (PROTÉGÉ)
   * ====================================================================
   */
  publishEvent(id: number): Observable<EventResponse> {
    return this.http.post<EventResponse>(`${this.apiUrl}/${id}/publish`, {});
  }

  /**
   * ====================================================================
   * CANCEL EVENT - Annuler un événement (PROTÉGÉ)
   * ====================================================================
   */
  cancelEvent(id: number): Observable<EventResponse> {
    return this.http.post<EventResponse>(`${this.apiUrl}/${id}/cancel`, {});
  }
}

/**
 * ====================================================================
 * EXEMPLE D'UTILISATION DANS UN COMPOSANT
 * ====================================================================
 * 
 * import { Component, OnInit } from '@angular/core';
 * import { EventService, Event } from './services/event.service';
 * 
 * export class EventsComponent implements OnInit {
 *   events: Event[] = [];
 *   loading = false;
 * 
 *   constructor(private eventService: EventService) {}
 * 
 *   ngOnInit(): void {
 *     this.loadEvents();
 *   }
 * 
 *   loadEvents(): void {
 *     this.loading = true;
 *     
 *     this.eventService.getEvents({ upcoming: true }).subscribe({
 *       next: (response) => {
 *         this.events = response.data.data;
 *         this.loading = false;
 *       },
 *       error: (error) => {
 *         console.error('Erreur', error);
 *         this.loading = false;
 *       }
 *     });
 *   }
 * }
 * 
 * ====================================================================
 */
