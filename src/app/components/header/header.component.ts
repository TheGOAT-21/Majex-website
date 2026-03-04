import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
  logoUrl = 'assets/logos/0-removebg-preview 1.png';
  logoAlt = 'MAJEX CONSULTING';
  isMenuOpen = false;

  private routerSubscription?: Subscription;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  isEventsRoute(): boolean {
    return this.router.url.startsWith('/evenements');
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}