import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { AssetService } from '../../services/asset.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  private assetService = inject(AssetService);

  currentYear = new Date().getFullYear();
  logoUrl     = '';
  logoAlt     = '';

  ngOnInit(): void {
    this.logoUrl = this.assetService.getUrl('logo-main');
    this.logoAlt = this.assetService.getAsset('logo-main')?.alt_text ?? 'MAJEX CONSULTING';
  }
}