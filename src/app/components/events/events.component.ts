import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService, Event } from '../../services/event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  allEvents: Event[] = [];
  loading = false;
  errorMessage = '';

  selectedType: string = 'all';
  eventTypes = [
    { value: 'all',        label: 'Tous' },
    { value: 'formation',  label: 'Formations' },
    { value: 'seminaire',  label: 'Séminaires' },
    { value: 'conference', label: 'Conférences' },
    { value: 'ceremonie',  label: 'Cérémonies' }
  ];

  imageErrors: Set<number> = new Set();

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.errorMessage = '';
    this.imageErrors.clear();

    this.eventService.getEvents().subscribe({
      next: (response: any) => {
        const data = response.data?.data || response.data || response;

        this.allEvents = (data as Event[])
          .filter(e => e.status === 'published' && new Date(e.date) > new Date())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        this.applyFilter();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erreur chargement événements', err);
        this.errorMessage = 'Impossible de charger les événements. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  filterByType(type: string): void {
    this.selectedType = type;
    this.applyFilter();
  }

  private applyFilter(): void {
    this.events = this.selectedType === 'all'
      ? [...this.allEvents]
      : this.allEvents.filter(e => e.type === this.selectedType);
  }

  onImageError(eventId: number | undefined): void {
    if (eventId !== undefined) this.imageErrors.add(eventId);
  }

  hasImageError(eventId: number | undefined): boolean {
    return eventId !== undefined && this.imageErrors.has(eventId);
  }

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      formation:  '📚',
      seminaire:  '💼',
      conference: '🎤',
      ceremonie:  '🎓'
    };
    return icons[type] || '📅';
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      formation:  'Formation',
      seminaire:  'Séminaire',
      conference: 'Conférence',
      ceremonie:  'Cérémonie'
    };
    return labels[type] || type;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year:    'numeric',
      month:   'long',
      day:     'numeric',
      hour:    '2-digit',
      minute:  '2-digit'
    });
  }

  getDaysUntil(dateString: string): number {
    const diffTime = new Date(dateString).getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isUrgent(dateString: string): boolean {
    return this.getDaysUntil(dateString) <= 7;
  }

  isFree(event: Event): boolean {
    return !event.price || event.price === 0;
  }
}