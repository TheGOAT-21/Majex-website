import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EventService, Event } from '../../services/event.service';
import { ContactService, ContactMessage, ContactStats } from '../../services/contact.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  // Navigation
  activeTab: 'events' | 'contacts' | 'stats' = 'events';
  
  // User info
  currentUser: any = null;
  
  // Events
  events: Event[] = [];
  loadingEvents = false;
  showEventModal = false;
  editingEvent: Partial<Event> | null = null;
  isNewEvent = false;
  
  // Contacts
  contacts: ContactMessage[] = [];
  contactStats: ContactStats | null = null;
  loadingContacts = false;
  selectedContact: ContactMessage | null = null;
  showContactModal = false;
  
  // Messages
  successMessage = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private contactService: ContactService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier auth et récupérer l'utilisateur actuel
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Charger les données
    this.loadEvents();
    this.loadContacts();
    this.loadContactStats();
  }

  // ========== NAVIGATION ==========
  setTab(tab: 'events' | 'contacts' | 'stats'): void {
    this.activeTab = tab;
  }

  // ========== EVENTS CRUD ==========
  loadEvents(): void {
    this.loadingEvents = true;
    this.eventService.getEvents().subscribe({
      next: (response: any) => {
        // Gérer différentes structures de réponse
        this.events = response.data?.data || response.data || response;
        this.loadingEvents = false;
      },
      error: (err) => {
        console.error('Erreur chargement événements', err);
        this.loadingEvents = false;
      }
    });
  }

  openNewEventModal(): void {
    this.isNewEvent = true;
    this.editingEvent = {
      title: '',
      description: '',
      type: 'formation',
      date: '',
      location: '',
      status: 'draft'
    };
    this.showEventModal = true;
  }

  openEditEventModal(event: Event): void {
    this.isNewEvent = false;
    this.editingEvent = { ...event };
    this.showEventModal = true;
  }

  closeEventModal(): void {
    this.showEventModal = false;
    this.editingEvent = null;
  }

  saveEvent(): void {
    if (!this.editingEvent) return;

    // Convertir en Event complet
    const eventData = this.editingEvent as Event;

    if (this.isNewEvent) {
      this.eventService.createEvent(eventData).subscribe({
        next: () => {
          this.successMessage = 'Événement créé avec succès';
          this.loadEvents();
          this.closeEventModal();
          this.clearMessages();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la création';
        }
      });
    } else {
      if (!eventData.id) {
        this.errorMessage = 'ID événement manquant';
        return;
      }
      
      this.eventService.updateEvent(eventData.id, eventData).subscribe({
        next: () => {
          this.successMessage = 'Événement mis à jour';
          this.loadEvents();
          this.closeEventModal();
          this.clearMessages();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la mise à jour';
        }
      });
    }
  }

  deleteEvent(event: Event): void {
    if (!confirm(`Supprimer l'événement "${event.title}" ?`)) return;
    
    if (!event.id) {
      this.errorMessage = 'ID événement manquant';
      return;
    }

    this.eventService.deleteEvent(event.id).subscribe({
      next: () => {
        this.successMessage = 'Événement supprimé';
        this.loadEvents();
        this.clearMessages();
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la suppression';
      }
    });
  }

  publishEvent(event: Event): void {
    if (!event.id) {
      this.errorMessage = 'ID événement manquant';
      return;
    }
    
    this.eventService.publishEvent(event.id).subscribe({
      next: () => {
        this.successMessage = 'Événement publié';
        this.loadEvents();
        this.clearMessages();
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la publication';
      }
    });
  }

  // ========== CONTACTS ==========
  loadContacts(): void {
    this.loadingContacts = true;
    this.contactService.getMessages().subscribe({
      next: (response: any) => {
        // Gérer différentes structures de réponse
        this.contacts = response.data?.data || response.data || response;
        this.loadingContacts = false;
      },
      error: (err) => {
        console.error('Erreur chargement contacts', err);
        this.loadingContacts = false;
      }
    });
  }

  loadContactStats(): void {
    this.contactService.getStats().subscribe({
      next: (response: any) => {
        // Gérer différentes structures de réponse
        this.contactStats = response.data || response;
      },
      error: (err) => {
        console.error('Erreur chargement stats', err);
      }
    });
  }

  viewContact(contact: ContactMessage): void {
    this.selectedContact = contact;
    this.showContactModal = true;
    
    // Marquer comme lu si non lu
    if (contact.status === 'unread' && contact.id) {
      this.contactService.markAsRead(contact.id).subscribe({
        next: () => {
          this.loadContacts();
          this.loadContactStats();
        }
      });
    }
  }

  closeContactModal(): void {
    this.showContactModal = false;
    this.selectedContact = null;
  }

  updateContactStatus(contactId: number, status: string): void {
    if (status === 'replied') {
      this.contactService.markAsReplied(contactId).subscribe({
        next: () => {
          this.successMessage = 'Statut mis à jour';
          this.loadContacts();
          this.loadContactStats();
          this.closeContactModal();
          this.clearMessages();
        },
        error: () => {
          this.errorMessage = 'Erreur lors de la mise à jour';
        }
      });
    }
  }

  deleteContact(contactId: number): void {
    if (!confirm('Supprimer ce message ?')) return;

    this.contactService.deleteMessage(contactId).subscribe({
      next: () => {
        this.successMessage = 'Message supprimé';
        this.loadContacts();
        this.loadContactStats();
        this.closeContactModal();
        this.clearMessages();
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la suppression';
      }
    });
  }

  // ========== UTILS ==========
  logout(): void {
    if (confirm('Se déconnecter ?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  clearMessages(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }
}