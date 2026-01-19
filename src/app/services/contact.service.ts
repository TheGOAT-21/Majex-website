import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

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

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getMessage(id: number): Observable<ContactMessage> {
    return this.http.get<ContactMessage>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  markAsRead(id: number): Observable<ContactMessage> {
    return this.http.patch<ContactMessage>(`${this.apiUrl}/${id}/read`, {}, { headers: this.getHeaders() });
  }

  markAsReplied(id: number): Observable<ContactMessage> {
    return this.http.patch<ContactMessage>(`${this.apiUrl}/${id}/replied`, {}, { headers: this.getHeaders() });
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getStats(): Observable<ContactStats> {
    return this.http.get<ContactStats>(`${this.apiUrl}/stats`, { headers: this.getHeaders() });
  }
}
