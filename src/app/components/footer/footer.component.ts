import { Component, inject } from '@angular/core';
import { AssetService } from '../../services/asset.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  private assetService = inject(AssetService);

  currentYear = new Date().getFullYear();

  get logoUrl() { return this.assetService.getUrl('logo-main'); }
  get logoAlt() { return this.assetService.getAsset('logo-main')?.alt_text ?? 'MAJEX CONSULTING'; }
}