import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { AssetService } from '../../services/asset.service';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent implements OnInit {
  private assetService = inject(AssetService);

  heroImageUrl = '';
  heroImageAlt = '';

  ngOnInit(): void {
    this.heroImageUrl = this.assetService.getUrl('hero-main');
    this.heroImageAlt = this.assetService.getAsset('hero-main')?.alt_text ?? 'Formation professionnelle en cours';
  }
}