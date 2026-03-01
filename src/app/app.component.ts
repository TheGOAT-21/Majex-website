import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AssetService } from './services/asset.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MAJEX CONSULTING';

  private assetService = inject(AssetService);

  ngOnInit(): void {
    // Précharge tous les assets une seule fois au démarrage
    this.assetService.loadAll().subscribe();
  }
}