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
  loading = false;
  errorMessage = '';
  
  // Filtres
  selectedType: string = 'all';
  eventTypes = [
    { value: 'all', label: 'Tous' },
    { value: 'formation', label: 'Formations' },
    { value: 'seminaire', label: 'Séminaires' },
    { value: 'conference', label: 'Conférences' },
    { value: 'ceremonie', label: 'Cérémonies' }
  ];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.errorMessage = '';
    
    // Paramètres de requête
    const params: any = {
      status: 'published',
      upcoming: true
    };
    
    if (this.selectedType !== 'all') {
      params.type = this.selectedType;
    }

    this.eventService.getEvents().subscribe({
      next: (response: any) => {
        // Gérer différentes structures de réponse
        const data = response.data?.data || response.data || response;
        
        // Filtrer les événements publiés et à venir
        this.events = data.filter((event: Event) => 
          event.status === 'published' && 
          new Date(event.date) > new Date()
        );
        
        // Filtrer par type si nécessaire
        if (this.selectedType !== 'all') {
          this.events = this.events.filter(e => e.type === this.selectedType);
        }
        
        // Trier par date (plus proche en premier)
        this.events.sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement événements', err);
        this.errorMessage = 'Impossible de charger les événements';
        this.loading = false;
      }
    });
  }

  filterByType(type: string): void {
    this.selectedType = type;
    this.loadEvents();
  }

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      formation: '📚',
      seminaire: '💼',
      conference: '🎤',
      ceremonie: '🎓'
    };
    return icons[type] || '📅';
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      formation: 'Formation',
      seminaire: 'Séminaire',
      conference: 'Conférence',
      ceremonie: 'Cérémonie'
    };
    return labels[type] || type;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('fr-FR', options);
  }

  getDaysUntil(dateString: string): number {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}