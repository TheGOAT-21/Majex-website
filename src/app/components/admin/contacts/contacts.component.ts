import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactMessage, ContactStats } from '../../../services/contact.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts.component.html'
})
export class ContactsComponent {
  @Input() contacts: ContactMessage[] = [];
  @Input() contactStats: ContactStats | null = null;
  @Input() loadingContacts = false;
  @Input() selectedContact: ContactMessage | null = null;
  @Input() showContactModal = false;

  @Output() viewContact = new EventEmitter<ContactMessage>();
  @Output() closeModal = new EventEmitter<void>();
  @Output() updateStatus = new EventEmitter<{ id: number; status: string }>();
  @Output() deleteContact = new EventEmitter<number>();
}
