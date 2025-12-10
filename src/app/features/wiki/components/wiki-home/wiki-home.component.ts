import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface WikiSection {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-wiki-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wiki-home.component.html',
  styleUrl: './wiki-home.component.scss'
})
export class WikiHomeComponent {
  wikiSections: WikiSection[] = [
    {
      title: 'Monde',
      description: 'Découvrez les régions, quêtes et monstres qui peuplent l\'univers de Mobaria.',
      icon: '🌍',
      route: '/wiki/world',
      color: 'var(--color-blue)'
    },
    {
      title: 'Mécaniques',
      description: 'Apprenez les systèmes d\'expérience, de craft, et les stratégies pour les donjons.',
      icon: '⚙️',
      route: '/wiki/mechanics',
      color: 'var(--color-green)'
    },
    {
      title: 'Classes',
      description: 'Explorez les différentes classes, leurs capacités uniques et styles de jeu.',
      icon: '👤',
      route: '/wiki/classes',
      color: 'var(--color-ruby)'
    }
  ];
}