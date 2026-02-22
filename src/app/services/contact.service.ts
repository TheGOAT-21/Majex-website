import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at?: string;
  updated_at?: string;
}

export interface ContactStats {
  total: number;
  unread: number;
  replied: number;
  this_week: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/api/contacts`;

  constructor(private http: HttpClient) {}

  // Formulaire public (sans auth)
  sendMessage(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/contact`, data);
  }

  // Admin — l'interceptor ajoute automatiquement le token
  getMessages(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getMessage(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  markAsRead(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, { status: 'read' });
  }

  markAsReplied(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, { status: 'replied' });
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }
}
