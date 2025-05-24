import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route?: string;
  icon?: string;
  children?: NavItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-wiki-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './wiki-sidebar.component.html',
  styleUrl: './wiki-sidebar.component.scss'
})
export class WikiSidebarComponent {
  navItems: NavItem[] = [
    {
      label: 'Monde',
      icon: '🌍',
      expanded: false,
      children: [
        { label: 'Quêtes', route: '/wiki/world/quests' },
        { label: 'Monstres', route: '/wiki/world/monsters' },
        { label: 'Zones', route: '/wiki/world/zones' }
      ]
    },
    {
      label: 'Mécaniques',
      icon: '⚙️',
      expanded: false,
      children: [
        { label: 'Expérience', route: '/wiki/mechanics/xp' },
        { label: 'Crafts', route: '/wiki/mechanics/crafts' },
        { label: 'Donjons', route: '/wiki/mechanics/dungeons' },
        { label: 'PvP', route: '/wiki/mechanics/pvp' }
      ]
    },
    {
      label: 'Classes',
      icon: '👤',
      route: '/wiki/classes'
    }
  ];
  
  toggleExpand(item: NavItem) {
    item.expanded = !item.expanded;
  }
}