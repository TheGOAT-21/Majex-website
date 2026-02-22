import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Event } from '../../../services/event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './events.component.html'
})
export class EventsComponent {
  @Input() events: Event[] = [];
  @Input() loadingEvents = false;
  @Input() showEventModal = false;
  @Input() editingEvent: Partial<Event> | null = null;
  @Input() isNewEvent = false;

  @Output() openNew = new EventEmitter<void>();
  @Output() openEdit = new EventEmitter<Event>();
  @Output() closeModal = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() delete = new EventEmitter<Event>();
  @Output() publish = new EventEmitter<Event>();
}
