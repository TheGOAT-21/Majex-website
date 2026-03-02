import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { HeroComponent } from '../hero/hero.component';
import { AboutComponent } from '../about/about.component';
import { ServicesComponent } from '../services/services.component';
import { ReferencesComponent } from '../references/references.component';
import { ContactComponent } from '../contact/contact.component';
import { FooterComponent } from '../footer/footer.component';
import { EventsComponent } from '../events/events.component';
import { AssetService } from '../../services/asset.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    ServicesComponent,
    ReferencesComponent,
    ContactComponent,
    FooterComponent,
    EventsComponent
  ],
  templateUrl:'./home.component.html'
})
export class HomeComponent implements OnInit {
  private assetService = inject(AssetService);
  assetsReady = false;

  ngOnInit(): void {
    this.assetService.loadAll().subscribe(() => {
      this.assetsReady = true;
    });
  }
}