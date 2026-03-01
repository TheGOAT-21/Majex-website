import { Component, inject } from '@angular/core';
import { AssetService } from '../../services/asset.service';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  private assetService = inject(AssetService);

  get heroImageUrl()  { return this.assetService.getUrl('hero-main'); }
  get heroImageAlt()  { return this.assetService.getAsset('hero-main')?.alt_text ?? 'Formation professionnelle en cours'; }
}