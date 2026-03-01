import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() currentUser: any;
  @Input() activeTab: string = 'dashboard';
  @Output() logoutClick = new EventEmitter<void>();

  getPageTitle(): string {
    const titles: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'events':    'Événements',
      'contacts':  'Messages',
      'media':     'Médiathèque',
      'stats':     'Statistiques',
      'settings':  'Paramètres'
    };
    return titles[this.activeTab] || 'Dashboard';
  }

  onLogout(): void {
    this.logoutClick.emit();
  }
}