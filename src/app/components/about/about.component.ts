import { Component, inject } from '@angular/core';
import { AssetService } from '../../services/asset.service';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  private assetService = inject(AssetService);

  get officeImageUrl()  { return this.assetService.getUrl('about-office'); }
  get teamImageUrl()    { return this.assetService.getUrl('about-team'); }
  get fdfpLogoUrl()     { return this.assetService.getUrl('logo-fdfp'); }
  get metfpaLogoUrl()   { return this.assetService.getUrl('logo-metfpa'); }
}