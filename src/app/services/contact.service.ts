import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * ====================================================================
 * SERVICE CONTACT
 * ====================================================================
 * 
 * Gère le formulaire de contact et l'administration des messages
 */

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * ====================================================================
   * SEND MESSAGE - Envoyer un message de contact (PUBLIC)
   * ====================================================================
   * 
   * Utilisation dans le composant contact :
   * 
   * onSubmit(): void {
   *   if (this.contactForm.valid) {
   *     this.loading = true;
   *     
   *     this.contactService.sendMessage(this.contactForm.value).subscribe({
   *       next: (response) => {
   *         this.successMessage = response.message;
   *         this.contactForm.reset();
   *         this.loading = false;
   *       },
   *       error: (error) => {
   *         this.errorMessage = 'Une erreur est survenue';
   *         this.loading = false;
   *       }
   *     });
   *   }
   * }
   */
  sendMessage(message: ContactMessage): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${this.apiUrl}/contact`, message);
  }

  /**
   * ====================================================================
   * MÉTHODES ADMIN (PROTÉGÉES)
   * ====================================================================
   */

  /**
   * Récupérer tous les messages (admin)
   */
  getMessages(status?: string): Observable<any> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get(`${this.apiUrl}/contacts`, { params });
  }

  /**
   * Récupérer un message par ID
   */
  getMessage(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/contacts/${id}`);
  }

  /**
   * Mettre à jour le statut d'un message
   */
  updateMessage(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/contacts/${id}`, data);
  }

  /**
   * Supprimer un message
   */
  deleteMessage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/contacts/${id}`);
  }

  /**
   * Récupérer les statistiques des messages
   */
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/contacts/stats`);
  }
}
