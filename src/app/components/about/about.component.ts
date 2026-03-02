import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { AssetService } from '../../services/asset.service';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit {
  private assetService = inject(AssetService);

  officeImageUrl = '';
  teamImageUrl   = '';
  fdfpLogoUrl    = '';
  metfpaLogoUrl  = '';

  ngOnInit(): void {
    this.officeImageUrl = this.assetService.getUrl('about-office');
    this.teamImageUrl   = this.assetService.getUrl('about-team');
    this.fdfpLogoUrl    = this.assetService.getUrl('logo-fdfp');
    this.metfpaLogoUrl  = this.assetService.getUrl('logo-metfpa');
  }
}