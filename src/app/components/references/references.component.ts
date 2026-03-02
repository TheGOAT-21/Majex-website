import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetService, SiteAsset } from '../../services/asset.service';

@Component({
  selector: 'app-references',
  imports: [CommonModule],
  templateUrl: './references.component.html',
  styleUrl: './references.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferencesComponent implements OnInit {
  private assetService = inject(AssetService);

  fdfpLogoUrl    = '';
  codivalLogoUrl = '';
  oscnLogoUrl    = '';
  partners: SiteAsset[] = [];

  ngOnInit(): void {
    this.fdfpLogoUrl    = this.assetService.getUrl('logo-fdfp');
    this.codivalLogoUrl = this.assetService.getUrl('partner-codival');
    this.oscnLogoUrl    = this.assetService.getUrl('partner-oscn');
    this.partners       = this.assetService.getByCategory('partner');
  }

  staticPartners = [
    { key: 'partner-rti',          alt: 'RTI',                     src: 'assets/partenaire_logos/RTI.webp' },
    { key: 'partner-anac',         alt: 'ANAC',                    src: 'assets/partenaire_logos/ANAC.png' },
    { key: 'partner-port-abidjan', alt: "Port Autonome d'Abidjan", src: 'assets/partenaire_logos/Port Autonome Abidjan.png' },
    { key: 'partner-oscn',         alt: 'OSCN',                    src: 'assets/partenaire_logos/OSCN.png' },
    { key: 'partner-aderiz',       alt: 'ADERIZ',                  src: 'assets/partenaire_logos/ADERIZ.png' },
    { key: 'partner-codival',      alt: 'CODIVAL',                 src: 'assets/partenaire_logos/codival.svg' },
    { key: 'partner-kaera',        alt: 'Kaera',                   src: 'assets/partenaire_logos/Kaera.svg' },
  ];
}