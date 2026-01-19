import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EventService, Event } from '../../services/event.service';
import { ContactService } from '../../services/contact.service';

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
  contacts: any[] = [];
  contactStats: any = null;
  loadingContacts = false;
  selectedContact: any = null;
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
    // Vérifier auth
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
    
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
      next: (response) => {
        this.events = response.data.data;
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

    if (this.isNewEvent) {
      this.eventService.createEvent(this.editingEvent).subscribe({
        next: (response) => {
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
      this.eventService.updateEvent(this.editingEvent.id!, this.editingEvent).subscribe({
        next: (response) => {
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

    this.eventService.deleteEvent(event.id).subscribe({
      next: () => {
        this.successMessage = 'Événement supprimé';
        this.loadEvents();
        this.clearMessages();
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la suppression';
      }
    });
  }

  publishEvent(event: Event): void {
    this.eventService.publishEvent(event.id).subscribe({
      next: () => {
        this.successMessage = 'Événement publié';
        this.loadEvents();
        this.clearMessages();
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la publication';
      }
    });
  }

  // ========== CONTACTS ==========
  loadContacts(): void {
    this.loadingContacts = true;
    this.contactService.getMessages().subscribe({
      next: (response) => {
        this.contacts = response.data.data;
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
      next: (response) => {
        this.contactStats = response.data;
      }
    });
  }

  viewContact(contact: any): void {
    this.selectedContact = contact;
    this.showContactModal = true;
    
    // Marquer comme lu
    if (contact.status === 'unread') {
      this.contactService.updateMessage(contact.id, { status: 'read' }).subscribe({
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
    this.contactService.updateMessage(contactId, { status }).subscribe({
      next: () => {
        this.successMessage = 'Statut mis à jour';
        this.loadContacts();
        this.loadContactStats();
        this.closeContactModal();
        this.clearMessages();
      }
    });
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
      }
    });
  }

  // ========== UTILS ==========
  logout(): void {
    if (confirm('Se déconnecter ?')) {
      this.authService.logout().subscribe(() => {
        this.router.navigate(['/login']);
      });
    }
  }

  clearMessages(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }
}
