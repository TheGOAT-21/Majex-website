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
  // Champ local uniquement — jamais envoyé tel quel au backend
  _imageFile?: File | null;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/api/events`;

  constructor(private http: HttpClient) {}

  getEvents(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getEvent(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Créer un événement.
   * Si _imageFile est présent → multipart/form-data
   * Sinon → JSON classique
   */
  createEvent(event: Partial<Event>): Observable<any> {
    if (event._imageFile instanceof File) {
      return this.http.post<any>(this.apiUrl, this.toFormData(event));
    }
    const { _imageFile, ...payload } = event;
    return this.http.post<any>(this.apiUrl, payload);
  }

  /**
   * Mettre à jour un événement.
   * Laravel ne supporte pas PUT multipart → POST + _method=PUT
   */
  updateEvent(id: number, event: Partial<Event>): Observable<any> {
    if (event._imageFile instanceof File) {
      const fd = this.toFormData(event);
      fd.append('_method', 'PUT');
      return this.http.post<any>(`${this.apiUrl}/${id}`, fd);
    }
    const { _imageFile, ...payload } = event;
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload);
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

  /** Convertit un objet Event en FormData pour envoi multipart. */
  private toFormData(event: Partial<Event>): FormData {
    const fd = new FormData();
    const fields: (keyof Event)[] = [
      'title', 'description', 'type', 'date', 'end_date',
      'location', 'max_participants', 'price', 'status', 'image_url'
    ];
    for (const key of fields) {
      const val = event[key];
      if (val !== null && val !== undefined && val !== '') {
        fd.append(key, String(val));
      }
    }
    if (event._imageFile instanceof File) {
      fd.append('image', event._imageFile, event._imageFile.name);
    }
    return fd;
  }
}