import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class AdminSidebarComponent {
  @Input() activeTab: string = 'dashboard';
  @Output() tabChange = new EventEmitter<string>();
  
  menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'events', label: 'Événements', icon: 'events' },
    { id: 'contacts', label: 'Messages', icon: 'contacts' },
    { id: 'stats', label: 'Statistiques', icon: 'stats' },
    { id: 'settings', label: 'Paramètres', icon: 'settings' }
  ];

  setTab(tab: string): void {
    this.tabChange.emit(tab);
  }
}
