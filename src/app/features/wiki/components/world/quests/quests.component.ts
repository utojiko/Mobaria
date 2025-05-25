import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Quest {
  id: string;
  title: string;
  level: number;
  description: string;
  region: string;
  rewards: string[];
  type: 'Principale' | 'Secondaire' | 'Événement';
}

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './quests.component.html',
  styleUrl: './quests.component.scss'
})
export class QuestsComponent {
  selectedRegion: string | null = null;
  selectedQuestType: string | null = null;
  minLevel: number = 1;

  quests: Quest[] = [
    {
      id: 'q1',
      title: 'L\'Épée du Destin',
      level: 5,
      description: 'Une ancienne prophétie parle d\'une épée légendaire capable de sceller les ténèbres. Votre quête commence dans le village de Rivebois, où vous devrez retrouver le forgeron qui connaît l\'emplacement des fragments de cette arme mystique.',
      region: 'Terres Centrales',
      rewards: ['500 XP', 'Épée de l\'Aube (Arme Rare)', '50 Pièces d\'or'],
      type: 'Principale'
    },
    {
      id: 'q2',
      title: 'La Forêt Maudite',
      level: 10,
      description: 'Les bois autrefois paisibles de la Sylve Obscure sont maintenant infestés de créatures corrompues. Les villageois de Taillebois vous supplient de découvrir la source de cette corruption et d\'y mettre fin.',
      region: 'Sylve Obscure',
      rewards: ['800 XP', 'Amulette de Purification (Accessoire Rare)', '100 Pièces d\'or'],
      type: 'Principale'
    },
    {
      id: 'q3',
      title: 'Les Mines Abandonnées',
      level: 8,
      description: 'D\'étranges bruits proviennent des anciennes mines de Rochefer. Le chef du village vous engage pour explorer les tunnels et découvrir ce qui terrorise les mineurs.',
      region: 'Montagnes du Nord',
      rewards: ['600 XP', 'Pioche Enchantée (Outil Rare)', '75 Pièces d\'or'],
      type: 'Secondaire'
    },
    {
      id: 'q4',
      title: 'Le Trésor Englouti',
      level: 15,
      description: 'Une carte au trésor vous mène vers une cité engloutie au large des côtes des Îles du Crépuscule. Des richesses inestimables vous attendent, mais aussi d\'anciens gardiens qui protègent les lieux.',
      region: 'Îles du Crépuscule',
      rewards: ['1000 XP', 'Couronne des Abysses (Casque Épique)', '200 Pièces d\'or'],
      type: 'Secondaire'
    },
    {
      id: 'q5',
      title: 'La Nuit des Étoiles Filantes',
      level: 20,
      description: 'Un événement astronomique rare approche. Le sage de la tour d\'Astralus vous demande de récupérer des fragments de météorites qui vont s\'écraser dans différentes régions de Mobaria.',
      region: 'Tout Mobaria',
      rewards: ['1200 XP', 'Bâton Stellaire (Arme Légendaire)', '300 Pièces d\'or'],
      type: 'Événement'
    },
    {
      id: 'q6',
      title: 'Les Larmes du Dragon',
      level: 25,
      description: 'Le dernier dragon de Mobaria est mourant. Avant de disparaître, il souhaite que ses larmes cristallisées soient utilisées pour forger une arme qui protégera le monde contre un mal ancien sur le point de s\'éveiller.',
      region: 'Terres du Feu',
      rewards: ['1500 XP', 'Écailles de Dragon (Armure Légendaire)', '400 Pièces d\'or'],
      type: 'Principale'
    },
    {
      id: 'q7',
      title: 'Le Marchand Disparu',
      level: 12,
      description: 'Un marchand ambulant bien connu a disparu sur la route commerciale entre Hautval et Port-Azur. Sa famille vous supplie de le retrouver et de le ramener sain et sauf.',
      region: 'Terres Centrales',
      rewards: ['750 XP', 'Anneau de Fortune (Accessoire Rare)', '120 Pièces d\'or'],
      type: 'Secondaire'
    },
    {
      id: 'q8',
      title: 'Festival des Récoltes',
      level: 5,
      description: 'Le Festival des Récoltes approche et le village de Champ-Doré a besoin d\'aide pour les préparatifs. Aidez les fermiers à préparer la fête et protégez les champs des créatures affamées.',
      region: 'Terres Centrales',
      rewards: ['400 XP', 'Chapeau de Festivalier (Cosmétique)', '50 Pièces d\'or'],
      type: 'Événement'
    }
  ];

  regions = [...new Set(this.quests.map(quest => quest.region))];
  types = [...new Set(this.quests.map(quest => quest.type))];

  get filteredQuests() {
    return this.quests.filter(quest => {
      const regionMatch = !this.selectedRegion || quest.region === this.selectedRegion;
      const typeMatch = !this.selectedQuestType || quest.type === this.selectedQuestType;
      const levelMatch = quest.level >= this.minLevel;

      return regionMatch && typeMatch && levelMatch;
    });
  }

  setRegionFilter(region: string | null) {
    this.selectedRegion = region;
  }

  setTypeFilter(type: string | null) {
    this.selectedQuestType = type;
  }

  setLevelFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    this.minLevel = parseInt(target.value, 10);
  }

  clearFilters() {
    this.selectedRegion = null;
    this.selectedQuestType = null;
    this.minLevel = 1;
  }

  getQuestTypeClass(type: string): string {
    switch (type) {
      case 'Principale': return 'quest-type-main';
      case 'Secondaire': return 'quest-type-side';
      case 'Événement': return 'quest-type-event';
      default: return '';
    }
  }
}