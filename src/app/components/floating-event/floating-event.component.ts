import { Component, OnInit, OnDestroy, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-floating-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-event.component.html',
  styleUrls: ['./floating-event.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloatingEventComponent implements OnInit, OnDestroy {
  currentEvent: Event | null = null;
  upcomingEvents: Event[] = [];
  currentIndex = 0;
  isVisible = false;
  isDismissed = false;
  scrollY = 0;

  private rotationInterval: any = null;

  constructor(
    private eventService: EventService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Vérifier si le widget a été fermé
    this.isDismissed = sessionStorage.getItem('floating_event_dismissed') === 'true';

    if (!this.isDismissed) {
      this.loadUpcomingEvents();
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    this.scrollY = window.scrollY;
    this.updateVisibility();
  }

  private loadUpcomingEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (events: Event[]) => {
        const now = new Date();
        this.upcomingEvents = events.filter((event: Event) => {
          const eventDate = new Date(event.date);
          return event.status === 'published' && eventDate > now;
        });

        if (this.upcomingEvents.length > 0) {
          this.currentEvent = this.upcomingEvents[0];
          this.updateVisibility();
          this.startRotation();
        }

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des événements:', err);
      }
    });
  }

  private startRotation(): void {
    if (this.upcomingEvents.length <= 1) return;

    this.rotationInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.upcomingEvents.length;
      this.currentEvent = this.upcomingEvents[this.currentIndex];
      this.cdr.markForCheck();
    }, 60000); // 60 secondes
  }

  private updateVisibility(): void {
    const shouldBeVisible = !this.isDismissed &&
                           this.upcomingEvents.length > 0 &&
                           this.scrollY >= 300;

    if (this.isVisible !== shouldBeVisible) {
      this.isVisible = shouldBeVisible;
      this.cdr.markForCheck();
    }
  }

  onDismiss(): void {
    this.isDismissed = true;
    this.isVisible = false;
    sessionStorage.setItem('floating_event_dismissed', 'true');
    this.cdr.markForCheck();
  }

  onViewEvent(): void {
    if (this.currentEvent) {
      this.router.navigate(['/evenements', this.currentEvent.id]);
    }
  }

  formatDate(date: string): string {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  ngOnDestroy(): void {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }
  }
}
