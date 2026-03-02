import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { AssetService } from '../../services/asset.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  private assetService = inject(AssetService);

  isMenuOpen = false;
  logoUrl    = '';
  logoAlt    = '';

  ngOnInit(): void {
    this.logoUrl = this.assetService.getUrl('logo-main');
    this.logoAlt = this.assetService.getAsset('logo-main')?.alt_text ?? 'MAJEX CONSULTING';
  }

  toggleMenu(): void { this.isMenuOpen = !this.isMenuOpen; }
  closeMenu(): void  { this.isMenuOpen = false; }
}