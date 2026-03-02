import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { AssetService } from '../../services/asset.service';
import { Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [AsyncPipe, NgIf],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit {
  private assetService = inject(AssetService);

  vm$!: Observable<{
    officeUrl: string;
    teamUrl: string;
    fdfpUrl: string;
    metfpaUrl: string;
  }>;

  ngOnInit(): void {
    this.vm$ = combineLatest([
      this.assetService.getUrl$('about-office'),
      this.assetService.getUrl$('about-team'),
      this.assetService.getUrl$('logo-fdfp'),
      this.assetService.getUrl$('logo-metfpa'),
    ]).pipe(
      map(([officeUrl, teamUrl, fdfpUrl, metfpaUrl]) => ({
        officeUrl, teamUrl, fdfpUrl, metfpaUrl
      }))
    );
  }
}