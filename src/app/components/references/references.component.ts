import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetService, SiteAsset } from '../../services/asset.service';

@Component({
  selector: 'app-references',
  imports: [CommonModule],
  templateUrl: './references.component.html',
  styleUrl: './references.component.css'
})
export class ReferencesComponent {
  private assetService = inject(AssetService);

  get fdfpLogoUrl()    { return this.assetService.getUrl('logo-fdfp'); }
  get codivalLogoUrl() { return this.assetService.getUrl('partner-codival'); }
  get oscnLogoUrl()    { return this.assetService.getUrl('partner-oscn'); }

  /**
   * Liste dynamique des partenaires depuis le backend.
   * Affiche les partenaires dans l'ordre de sort_order.
   */
  get partners(): SiteAsset[] {
    return this.assetService.getByCategory('partner');
  }

  /**
   * Fallback statique si le backend n'est pas encore chargé.
   * Utilisé dans le template via *ngIf="partners.length > 0; else staticPartners"
   */
  staticPartners = [
    { key: 'partner-rti',          alt: 'RTI',                       src: 'assets/partenaire_logos/RTI.webp' },
    { key: 'partner-anac',         alt: 'ANAC',                      src: 'assets/partenaire_logos/ANAC.png' },
    { key: 'partner-port-abidjan', alt: "Port Autonome d'Abidjan",   src: 'assets/partenaire_logos/Port Autonome Abidjan.png' },
    { key: 'partner-oscn',         alt: 'OSCN',                      src: 'assets/partenaire_logos/OSCN.png' },
    { key: 'partner-aderiz',       alt: 'ADERIZ',                    src: 'assets/partenaire_logos/ADERIZ.png' },
    { key: 'partner-codival',      alt: 'CODIVAL',                   src: 'assets/partenaire_logos/codival.svg' },
    { key: 'partner-kaera',        alt: 'Kaera',                     src: 'assets/partenaire_logos/Kaera.svg' },
  ];
}