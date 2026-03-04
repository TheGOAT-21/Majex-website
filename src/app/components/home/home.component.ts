import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { HeroComponent } from '../hero/hero.component';
import { AboutComponent } from '../about/about.component';
import { ServicesComponent } from '../services/services.component';
import { ReferencesComponent } from '../references/references.component';
import { ContactComponent } from '../contact/contact.component';
import { FooterComponent } from '../footer/footer.component';
import { EventsComponent } from '../events/events.component';
import { FloatingEventComponent } from '../floating-event/floating-event.component';

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
    EventsComponent,
    FloatingEventComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {}