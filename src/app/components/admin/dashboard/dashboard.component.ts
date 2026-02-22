import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../../services/event.service';
import { ContactMessage, ContactStats } from '../../../services/contact.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  @Input() events: Event[] = [];
  @Input() contacts: ContactMessage[] = [];
  @Input() contactStats: ContactStats | null = null;
  @Output() tabChange = new EventEmitter<string>();
}
