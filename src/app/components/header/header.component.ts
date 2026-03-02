import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { AssetService } from '../../services/asset.service';
import { Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  private assetService = inject(AssetService);

  isMenuOpen = false;
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

  toggleMenu(): void { this.isMenuOpen = !this.isMenuOpen; }
  closeMenu(): void  { this.isMenuOpen = false; }
}