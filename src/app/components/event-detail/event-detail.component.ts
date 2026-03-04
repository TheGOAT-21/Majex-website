import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event, EventType } from '../../models/event.model';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  isLoading = true;
  notFound = false;
  participantsPercentage = 0;
  isPast = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEvent(+id);
    } else {
      this.notFound = true;
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  private loadEvent(id: number): void {
    this.isLoading = true;
    this.notFound = false;

    this.eventService.getEvent(id).subscribe({
      next: (event) => {
        if (event) {
          this.event = event;
          this.calculateParticipantsPercentage();
          this.checkIfPast();
        } else {
          this.notFound = true;
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'événement:', err);
        this.notFound = true;
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  private calculateParticipantsPercentage(): void {
    if (this.event && this.event.max_participants && this.event.current_participants) {
      this.participantsPercentage = (this.event.current_participants / this.event.max_participants) * 100;
    }
  }

  private checkIfPast(): void {
    if (this.event) {
      const eventDate = new Date(this.event.date);
      this.isPast = eventDate < new Date();
    }
  }

  formatDate(date: string): string {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  formatTime(date: string): string {
    const eventDate = new Date(date);
    return eventDate.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatPrice(price: number | null | undefined): string {
    if (price === null || price === undefined || price === 0) {
      return 'Gratuit';
    }
    return `${price.toLocaleString('fr-FR')} FCFA`;
  }

  getTypeLabel(type: EventType): string {
    const labels: Record<EventType, string> = {
      'formation': 'Formation',
      'seminaire': 'Séminaire',
      'conference': 'Conférence',
      'ceremonie': 'Cérémonie'
    };
    return labels[type] || type;
  }

  getTypeEmoji(type: EventType): string {
    const emojis: Record<EventType, string> = {
      'formation': '🎓',
      'seminaire': '💼',
      'conference': '🎤',
      'ceremonie': '🎉'
    };
    return emojis[type] || '📅';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'published': 'Ouvert aux inscriptions',
      'draft': 'Brouillon',
      'cancelled': 'Annulé',
      'completed': 'Terminé'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'published': 'bg-green-100 text-green-800',
      'draft': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800',
      'completed': 'bg-blue-100 text-blue-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  onRegister(): void {
    this.router.navigate(['/'], { fragment: 'contact' });
  }

  onBack(): void {
    this.router.navigate(['/evenements']);
  }
}
