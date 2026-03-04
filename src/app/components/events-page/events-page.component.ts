import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event, EventType } from '../../models/event.model';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

type FilterType = 'all' | EventType;

interface FilterOption {
  value: FilterType;
  label: string;
  emoji: string;
}

@Component({
  selector: 'app-events-page',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsPageComponent implements OnInit {
  allEvents: Event[] = [];
  upcomingEvents: Event[] = [];
  pastEvents: Event[] = [];

  filteredUpcomingEvents: Event[] = [];
  filteredPastEvents: Event[] = [];

  displayedUpcomingEvents: Event[] = [];
  displayedPastEvents: Event[] = [];

  upcomingPage = 1;
  pastPage = 1;
  pageSize = 9;

  selectedFilter: FilterType = 'all';

  filterOptions: FilterOption[] = [
    { value: 'all', label: 'Tous', emoji: '📅' },
    { value: 'formation', label: 'Formations', emoji: '🎓' },
    { value: 'seminaire', label: 'Séminaires', emoji: '💼' },
    { value: 'conference', label: 'Conférences', emoji: '🎤' },
    { value: 'ceremonie', label: 'Cérémonies', emoji: '🎉' }
  ];

  isLoading = true;
  error: string | null = null;

  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  private loadEvents(): void {
    this.isLoading = true;
    this.error = null;

    this.eventService.getEvents().subscribe({
      next: (events: Event[]) => {
        this.allEvents = events.filter((e: Event) => e.status === 'published');
        this.separateEvents();
        this.applyFilter();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = 'Impossible de charger les événements. Veuillez réessayer.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  private separateEvents(): void {
    const now = new Date();

    this.upcomingEvents = this.allEvents
      .filter(event => new Date(event.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    this.pastEvents = this.allEvents
      .filter(event => new Date(event.date) <= now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private applyFilter(): void {
    if (this.selectedFilter === 'all') {
      this.filteredUpcomingEvents = this.upcomingEvents;
      this.filteredPastEvents = this.pastEvents;
    } else {
      this.filteredUpcomingEvents = this.upcomingEvents.filter(e => e.type === this.selectedFilter);
      this.filteredPastEvents = this.pastEvents.filter(e => e.type === this.selectedFilter);
    }

    this.upcomingPage = 1;
    this.pastPage = 1;
    this.updateDisplayedEvents();
  }

  private updateDisplayedEvents(): void {
    this.displayedUpcomingEvents = this.filteredUpcomingEvents.slice(0, this.upcomingPage * this.pageSize);
    this.displayedPastEvents = this.filteredPastEvents.slice(0, this.pastPage * this.pageSize);
  }

  selectFilter(filter: FilterType): void {
    this.selectedFilter = filter;
    this.applyFilter();
    this.cdr.markForCheck();
  }

  getFilterCount(filter: FilterType): number {
    if (filter === 'all') {
      return this.allEvents.length;
    }
    return this.allEvents.filter(e => e.type === filter).length;
  }

  loadMoreUpcoming(): void {
    this.upcomingPage++;
    this.updateDisplayedEvents();
    this.cdr.markForCheck();
  }

  loadMorePast(): void {
    this.pastPage++;
    this.updateDisplayedEvents();
    this.cdr.markForCheck();
  }

  get hasMoreUpcoming(): boolean {
    return this.displayedUpcomingEvents.length < this.filteredUpcomingEvents.length;
  }

  get hasMorePast(): boolean {
    return this.displayedPastEvents.length < this.filteredPastEvents.length;
  }

  retry(): void {
    this.loadEvents();
  }

  formatDate(date: string): string {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  getDaysUntil(date: string): number {
    const eventDate = new Date(date);
    const now = new Date();
    const diff = eventDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getTypeLabel(type: EventType): string {
    const option = this.filterOptions.find(o => o.value === type);
    return option ? option.label.slice(0, -1) : type;
  }

  getTypeEmoji(type: EventType): string {
    const option = this.filterOptions.find(o => o.value === type);
    return option ? option.emoji : '📅';
  }

  formatPrice(price: number | null | undefined): string {
    if (price === null || price === undefined || price === 0) {
      return 'Gratuit';
    }
    return `${price.toLocaleString('fr-FR')} FCFA`;
  }
}
