import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  officeUrl = 'assets/images/pic7.jpg';
  teamUrl   = 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80';
  fdfpUrl   = 'assets/logos/fdfp.png';
  metfpaUrl = 'assets/logos/Logo-METFPA-2.png';
}