import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EventService, Event } from '../../services/event.service';
import { ContactService, ContactMessage, ContactStats } from '../../services/contact.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventsComponent } from './events/events.component';
import { ContactsComponent } from './contacts/contacts.component';
import { StatsComponent } from './stats/stats.component';
import { SettingsComponent } from './settings/settings.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    NavbarComponent,
    DashboardComponent,
    EventsComponent,
    ContactsComponent,
    StatsComponent,
    SettingsComponent
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  activeTab: 'dashboard' | 'events' | 'contacts' | 'stats' | 'settings' = 'dashboard';
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

  successMessage = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private contactService: ContactService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/mjx-admin-login-secure-2025']);
      return;
    }
    this.loadEvents();
    this.loadContacts();
    this.loadContactStats();
  }

  onTabChange(tab: string): void {
    this.activeTab = tab as 'dashboard' | 'events' | 'contacts' | 'stats' | 'settings';
  }

  // ========== EVENTS ==========
  loadEvents(): void {
    this.loadingEvents = true;
    this.eventService.getEvents().subscribe({
      next: (response: any) => {
        this.events = response.data?.data || response.data || response;
        this.loadingEvents = false;
      },
      error: (err: any) => {
        console.error('Erreur chargement événements', err);
        this.loadingEvents = false;
      }
    });
  }

  openNewEventModal(): void {
    this.isNewEvent = true;
    this.editingEvent = { title: '', description: '', type: 'formation', date: '', location: '', status: 'draft' };
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
        next: () => { this.showSuccess('Événement créé'); this.loadEvents(); this.closeEventModal(); },
        error: (err: any) => this.showError(err.error?.message || 'Erreur création')
      });
    } else {
      if (!this.editingEvent.id) { this.showError('ID manquant'); return; }
      this.eventService.updateEvent(this.editingEvent.id, this.editingEvent).subscribe({
        next: () => { this.showSuccess('Événement mis à jour'); this.loadEvents(); this.closeEventModal(); },
        error: (err: any) => this.showError(err.error?.message || 'Erreur mise à jour')
      });
    }
  }

  deleteEvent(event: Event): void {
    if (!confirm(`Supprimer "${event.title}" ?`)) return;
    if (!event.id) { this.showError('ID manquant'); return; }
    this.eventService.deleteEvent(event.id).subscribe({
      next: () => { this.showSuccess('Événement supprimé'); this.loadEvents(); },
      error: () => this.showError('Erreur suppression')
    });
  }

  publishEvent(event: Event): void {
    if (!event.id) { this.showError('ID manquant'); return; }
    this.eventService.publishEvent(event.id).subscribe({
      next: () => { this.showSuccess('Événement publié'); this.loadEvents(); },
      error: () => this.showError('Erreur publication')
    });
  }

  // ========== CONTACTS ==========
  loadContacts(): void {
    this.loadingContacts = true;
    this.contactService.getMessages().subscribe({
      next: (response: any) => {
        this.contacts = response.data?.data || response.data || response;
        this.loadingContacts = false;
      },
      error: (err: any) => { console.error(err); this.loadingContacts = false; }
    });
  }

  loadContactStats(): void {
    this.contactService.getStats().subscribe({
      next: (response: any) => { this.contactStats = response.data || response; },
      error: (err: any) => console.error(err)
    });
  }

  viewContact(contact: ContactMessage): void {
    this.selectedContact = contact;
    this.showContactModal = true;
    if (contact.status === 'unread' && contact.id) {
      this.contactService.markAsRead(contact.id).subscribe({
        next: () => { this.loadContacts(); this.loadContactStats(); }
      });
    }
  }

  closeContactModal(): void {
    this.showContactModal = false;
    this.selectedContact = null;
  }

  updateContactStatus(event: { id: number; status: string }): void {
    if (event.status === 'replied') {
      this.contactService.markAsReplied(event.id).subscribe({
        next: () => { this.showSuccess('Statut mis à jour'); this.loadContacts(); this.loadContactStats(); this.closeContactModal(); },
        error: () => this.showError('Erreur mise à jour')
      });
    }
  }

  deleteContact(contactId: number): void {
    if (!confirm('Supprimer ce message ?')) return;
    this.contactService.deleteMessage(contactId).subscribe({
      next: () => { this.showSuccess('Message supprimé'); this.loadContacts(); this.loadContactStats(); this.closeContactModal(); },
      error: () => this.showError('Erreur suppression')
    });
  }

  // ========== UTILS ==========
  logout(): void {
    if (confirm('Se déconnecter ?')) {
      this.authService.logout();
      this.router.navigate(['/mjx-admin-login-secure-2025']);
    }
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    this.errorMessage = '';
    setTimeout(() => this.successMessage = '', 3000);
  }

  private showError(msg: string): void {
    this.errorMessage = msg;
    setTimeout(() => this.errorMessage = '', 4000);
  }
}
