import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetService } from '../../services/asset.service';

interface FormationDomain {
  name: string;
  description: string;
  icon: string;
}

interface Testimonial {
  name: string;
  course: string;
  text: string;
  rating: number;
}

interface CaseStudy {
  title: string;
  client: string;
  challenge: string;
  solution: string;
  results: string[];
}

interface Space {
  name: string;
  capacity: string;
  equipment: string[];
  price: string;
  image: string;
}

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  private assetService = inject(AssetService);

  get formationImageUrl()    { return this.assetService.getUrl('service-formation'); }
  get conseilImageUrl()      { return this.assetService.getUrl('service-conseil'); }
  get recrutementImageUrl()  { return this.assetService.getUrl('service-recrutement'); }

  // Formation data
  formationTypes = {
    inter: {
      title: 'Formation Inter-Entreprise',
      description: 'Sessions ouvertes à tous les professionnels',
      benefits: [
        'Groupes de participants de différentes entreprises',
        'Partage d\'expériences variées',
        'Networking professionnel',
        'Calendrier fixe de sessions',
        'Coût optimisé par participant'
      ]
    },
    intra: {
      title: 'Formation Intra-Entreprise',
      description: 'Sessions dédiées exclusivement à votre équipe',
      benefits: [
        'Formation sur mesure pour votre entreprise',
        'Contenu adapté à vos besoins spécifiques',
        'Flexibilité des dates et horaires',
        'Dans vos locaux ou les nôtres',
        'Cohésion d\'équipe renforcée'
      ]
    }
  };

  formationDomains: FormationDomain[] = [
    { name: 'Ressources Humaines', description: 'Communication Interne, Gestion du Personnel', icon: 'users' },
    { name: 'Management', description: 'Leadership Général, Management d\'Équipe', icon: 'leader' },
    { name: 'Gestion des Projets', description: 'Méthodes & Outils, Planification', icon: 'project' },
    { name: 'Marketing', description: 'Gestion Commerciale, Marketing Digital', icon: 'marketing' },
    { name: 'Comptabilité', description: 'Finance, Contrôle de Gestion', icon: 'accounting' },
    { name: 'Logistique', description: 'Achats & Stocks, Supply Chain', icon: 'logistics' },
    { name: 'Secrétariat', description: 'Assistanat de Direction', icon: 'secretary' },
    { name: 'Audit', description: 'Contrôle, Conformité', icon: 'audit' },
    { name: 'Informatique & Bureautique', description: 'Pack Office, Outils Digitaux', icon: 'computer' },
    { name: 'Communication', description: 'Communication Corporate, Relations Publiques', icon: 'communication' },
    { name: 'Qualité & HSE', description: 'Normes ISO, Sécurité', icon: 'quality' },
    { name: 'Droit des Affaires', description: 'Contrats, Réglementation', icon: 'law' },
    { name: 'Entrepreneuriat', description: 'Création d\'Entreprise, Business Plan', icon: 'entrepreneur' },
    { name: 'Langues', description: 'Anglais, Français Professionnel', icon: 'languages' },
    { name: 'Développement Personnel', description: 'Leadership, Intelligence Émotionnelle', icon: 'personal' },
    { name: 'Agriculture & Agribusiness', description: 'Gestion Agricole Moderne', icon: 'agriculture' }
  ];

  testimonials: Testimonial[] = [
    {
      name: 'Marie KOUASSI',
      course: 'Formation Management d\'Équipe',
      text: 'Formation très enrichissante avec des formateurs compétents. J\'ai pu appliquer immédiatement les concepts appris dans mon entreprise.',
      rating: 5
    },
    {
      name: 'Jean DIABATE',
      course: 'Gestion de Projets',
      text: 'Excellente formation pratique. Les outils et méthodes enseignés m\'ont permis d\'améliorer significativement la gestion de mes projets.',
      rating: 5
    },
    {
      name: 'Awa TRAORE',
      course: 'Marketing Digital',
      text: 'Je recommande vivement! Formation complète et moderne qui m\'a ouvert de nouvelles perspectives professionnelles.',
      rating: 5
    }
  ];

  caseStudies: CaseStudy[] = [
    {
      title: 'Transformation Organisationnelle',
      client: 'Entreprise Agroalimentaire',
      challenge: 'Structure organisationnelle obsolète et manque de clarté dans les rôles',
      solution: 'Audit complet, redéfinition des postes, mise en place de procédures',
      results: ['Amélioration de 40% de la productivité', 'Réduction des conflits internes', 'Clarté des responsabilités']
    },
    {
      title: 'Digitalisation RH',
      client: 'Groupe de Distribution',
      challenge: 'Gestion RH manuelle et chronophage',
      solution: 'Implémentation d\'un SIRH, formation du personnel, automatisation des processus',
      results: ['Gain de temps de 60%', 'Meilleure traçabilité', 'Satisfaction employés +35%']
    }
  ];

  itServices = {
    development: [
      'Applications Web & Mobile sur mesure',
      'Systèmes de Gestion Intégrés (ERP)',
      'Sites E-commerce',
      'Plateformes Collaboratives',
      'APIs & Intégrations',
      'Maintenance & Support Technique'
    ],
    equipment: [
      'Ordinateurs de bureau & portables',
      'Serveurs & Infrastructure réseau',
      'Imprimantes & Scanners',
      'Projecteurs & Écrans',
      'Consommables (cartouches, papier)',
      'Logiciels & Licences'
    ]
  };

  spaces: Space[] = [
    { name: 'Salle de Formation 1', capacity: '20-30 personnes', equipment: ['Projecteur HD', 'Tableau blanc', 'Climatisation', 'WiFi haut débit', 'Tables modulables'], price: 'Sur devis', image: '/assets/images/salle-formation-1.jpg' },
    { name: 'Salle de Formation 2', capacity: '15-20 personnes', equipment: ['Écran interactif', 'Ordinateurs', 'Climatisation', 'WiFi', 'Espace pause'], price: 'Sur devis', image: '/assets/images/salle-formation-2.jpg' },
    { name: 'Salle de Conférence', capacity: '50-100 personnes', equipment: ['Système audio professionnel', 'Vidéoprojecteur', 'Podium', 'Micros sans fil', 'Caméra'], price: 'Sur devis', image: '/assets/images/salle-conference.jpg' },
    { name: 'Salle de Réunion Executive', capacity: '8-12 personnes', equipment: ['Écran TV 65"', 'Visioconférence', 'Table de réunion', 'Climatisation', 'Machine à café'], price: 'Sur devis', image: '/assets/images/salle-reunion.jpg' }
  ];

  activeFormationTab = 'domains';
  activeConseilTab = 'organisation';
  activeITTab = 'development';
  showSpaceModal = false;
  selectedSpace: Space | null = null;

  setFormationTab(tab: string) { this.activeFormationTab = tab; }
  setConseilTab(tab: string)   { this.activeConseilTab = tab; }
  setITTab(tab: string)        { this.activeITTab = tab; }

  openSpaceModal(space: Space)  { this.selectedSpace = space; this.showSpaceModal = true; }
  closeSpaceModal()              { this.showSpaceModal = false; this.selectedSpace = null; }
  getStars(rating: number): number[] { return Array(rating).fill(0); }
}