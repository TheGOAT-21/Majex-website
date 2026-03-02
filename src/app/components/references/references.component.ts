import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { AssetService, SiteAsset } from '../../services/asset.service';
import { Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-references',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor],
  templateUrl: './references.component.html',
  styleUrl: './references.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferencesComponent implements OnInit {
  private assetService = inject(AssetService);

  vm$!: Observable<{ fdfpUrl: string; codivalUrl: string; oscnUrl: string }>;
  partners$!: Observable<SiteAsset[]>;

  ngOnInit(): void {
    this.vm$ = combineLatest([
      this.assetService.getUrl$('logo-fdfp'),
      this.assetService.getUrl$('partner-codival'),
      this.assetService.getUrl$('partner-oscn'),
    ]).pipe(
      map(([fdfpUrl, codivalUrl, oscnUrl]) => ({ fdfpUrl, codivalUrl, oscnUrl }))
    );

    this.partners$ = this.assetService.getByCategory$('partner');
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