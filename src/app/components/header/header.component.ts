import { Component, inject } from '@angular/core';
import { AssetService } from '../../services/asset.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private assetService = inject(AssetService);

  isMenuOpen = false;

  get logoUrl() { return this.assetService.getUrl('logo-main'); }
  get logoAlt() { return this.assetService.getAsset('logo-main')?.alt_text ?? 'MAJEX CONSULTING'; }

  toggleMenu() { this.isMenuOpen = !this.isMenuOpen; }
  closeMenu()  { this.isMenuOpen = false; }
}