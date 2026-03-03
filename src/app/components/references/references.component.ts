import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-references',
  standalone: true,
  imports: [NgFor],
  templateUrl: './references.component.html',
  styleUrl: './references.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferencesComponent {
  fdfpUrl    = 'assets/logos/fdfp.png';
  codivalUrl = 'assets/partenaire_logos/codival.svg';
  oscnUrl    = 'assets/partenaire_logos/OSCN.png';

  partners = [
    { alt: 'RTI',          src: 'assets/partenaire_logos/RTI.webp' },
    { alt: 'ANAC',         src: 'assets/partenaire_logos/ANAC.png' },
    { alt: 'Port Abidjan', src: 'assets/partenaire_logos/Port Autonome Abidjan.png' },
    { alt: 'OSCN',         src: 'assets/partenaire_logos/OSCN.png' },
    { alt: 'ADERIZ',       src: 'assets/partenaire_logos/ADERIZ.png' },
    { alt: 'CODIVAL',      src: 'assets/partenaire_logos/codival.svg' },
    { alt: 'Kaera',        src: 'assets/partenaire_logos/Kaera.svg' },
  ];
}