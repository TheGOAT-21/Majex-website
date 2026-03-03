import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  logoUrl = 'assets/logos/0-removebg-preview 1.png';
  logoAlt = 'MAJEX CONSULTING';
  currentYear = new Date().getFullYear();
}