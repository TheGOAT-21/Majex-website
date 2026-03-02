import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';  // ← NgIf requis pour *ngIf
import { AssetService } from '../../services/asset.service';
import { Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [AsyncPipe, NgIf],  // ← les deux sont nécessaires
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent implements OnInit {
  private assetService = inject(AssetService);

  vm$!: Observable<{ url: string; alt: string }>;

  ngOnInit(): void {
    this.vm$ = combineLatest([
      this.assetService.getUrl$('hero-main'),
      this.assetService.getAsset$('hero-main'),
    ]).pipe(
      map(([url, asset]) => ({
        url,
        alt: asset?.alt_text ?? 'Formation professionnelle en cours'
      }))
    );
  }
}