import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-world',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './world.component.html',
  styleUrl: './world.component.scss'
})
export class WorldComponent {
  sections = [
    {
      title: 'Quêtes',
      description: 'Découvre les quêtes épiques qui t\'attendent dans le monde de Mobaria.',
      route: '/wiki/world/quests',
      icon: '📜'
    },
    {
      title: 'Monstres',
      description: 'Apprends à connaître les créatures qui peuplent notre monde.',
      route: '/wiki/world/monsters',
      icon: '👾'
    },
    {
      title: 'Zones',
      description: 'Explore les différentes régions et leurs secrets.',
      route: '/wiki/world/zones',
      icon: '🗺️'
    }
  ];
}