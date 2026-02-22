import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../../services/event.service';
import { ContactMessage, ContactStats } from '../../../services/contact.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html'
})
export class StatsComponent {
  @Input() events: Event[] = [];
  @Input() contacts: ContactMessage[] = [];
  @Input() contactStats: ContactStats | null = null;

  get publishedEvents(): number {
    return this.events.filter(e => e.status === 'published').length;
  }

  get draftEvents(): number {
    return this.events.filter(e => e.status === 'draft').length;
  }

  get replyRate(): number {
    if (!this.contactStats?.total) return 0;
    return Math.round((this.contactStats.replied / this.contactStats.total) * 100);
  }
}
