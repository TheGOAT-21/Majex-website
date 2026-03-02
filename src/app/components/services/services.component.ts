import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe, NgIf, CommonModule } from '@angular/common';
import { AssetService } from '../../services/asset.service';
import { Observable, combineLatest, map } from 'rxjs';

interface Space {
  name: string;
  capacity: string;
  equipment: string[];
  price: string;
  image: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [AsyncPipe, NgIf, CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesComponent implements OnInit {
  private assetService = inject(AssetService);

  vm$!: Observable<{
    formationUrl: string;
    conseilUrl: string;
    recrutementUrl: string;
  }>;

  ngOnInit(): void {
    this.vm$ = combineLatest([
      this.assetService.getUrl$('service-formation'),
      this.assetService.getUrl$('service-conseil'),
      this.assetService.getUrl$('service-recrutement'),
    ]).pipe(
      map(([formationUrl, conseilUrl, recrutementUrl]) => ({
        formationUrl, conseilUrl, recrutementUrl
      }))
    );
  }

  showSpaceModal  = false;
  selectedSpace: Space | null = null;

  recrutementSteps = [
    { num: 1, title: 'Analyse du besoin',          desc: 'Définition du profil et des compétences recherchées' },
    { num: 2, title: 'Sourcing & chasse',           desc: 'Recherche active de candidats qualifiés' },
    { num: 3, title: 'Présélection & évaluation',  desc: 'Tests techniques et entretiens approfondis' },
    { num: 4, title: 'Présentation des candidats', desc: 'Shortlist des meilleurs profils' },
    { num: 5, title: 'Suivi & intégration',        desc: 'Accompagnement post-recrutement' },
  ];

  secteurs = ['Finance & Banque', 'Commerce & Vente', 'Santé & Pharma', 'Logistique', 'Informatique & Tech', 'Industrie', 'Éducation', 'Tous secteurs'];

  itCards = [
    { title: 'Cyber sécurité',          desc: 'Protection des données, audit de sécurité et conformité RGPD',                            img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80', color: 'primary' },
    { title: 'Intelligence artificielle', desc: 'Solutions IA, machine learning et automatisation intelligente',                          img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80', color: 'accent' },
    { title: 'Big data',                desc: 'Analyse de données massives, Business Intelligence et data visualization',                  img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', color: 'primary' },
    { title: 'Développement',           desc: 'Applications métier, sites web et solutions mobiles sur mesure',                           img: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=600&q=80', color: 'primary' },
    { title: 'Audit & Conseil',         desc: 'Diagnostic IT, architecture système et cybersécurité',                                     img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80', color: 'accent' },
    { title: 'Équipement IT',           desc: 'Fourniture complète d\'ordinateurs, réseaux et matériel bureautique',                      img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80', color: 'primary' },
  ];

  espaces = [
    { name: 'Formation',   capacity: '10-100 personnes', equipment: ['Audiovisuel', 'Internet'] },
    { name: 'Réunion',     capacity: 'Équipement complet', equipment: ['Vidéoprojecteur', 'Paperboard'] },
    { name: 'Conférence',  capacity: 'Grands événements', equipment: ['Scène', 'Son & lumière'] },
  ];

  openSpaceModal(space: Space): void { this.selectedSpace = space; this.showSpaceModal = true; }
  closeSpaceModal(): void            { this.showSpaceModal = false; this.selectedSpace = null; }
  getStars(rating: number): number[] { return Array(rating).fill(0); }
}