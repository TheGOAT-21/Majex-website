import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Event {
  id?: number;
  title: string;
  description: string;
  type: string;
  date: string;
  end_date?: string;
  location: string;
  max_participants?: number;
  current_participants?: number;
  price?: number;
  formatted_price?: string;
  image_url?: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/api/events`;

  constructor(private http: HttpClient) {}

  // L'interceptor ajoute automatiquement le token Bearer sur toutes les requêtes
  getEvents(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getEvent(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createEvent(event: Partial<Event>): Observable<any> {
    return this.http.post<any>(this.apiUrl, event);
  }

  updateEvent(id: number, event: Partial<Event>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  publishEvent(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/publish`, {});
  }

  cancelEvent(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/cancel`, {});
  }
}
