import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { AssetService } from '../../services/asset.service';
import { Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [AsyncPipe, NgIf],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  private assetService = inject(AssetService);

  currentYear = new Date().getFullYear();
  vm$!: Observable<{ url: string; alt: string }>;

  ngOnInit(): void {
    this.vm$ = combineLatest([
      this.assetService.getUrl$('logo-main'),
      this.assetService.getAsset$('logo-main'),
    ]).pipe(
      map(([url, asset]) => ({
        url,
        alt: asset?.alt_text ?? 'MAJEX CONSULTING'
      }))
    );
  }
}