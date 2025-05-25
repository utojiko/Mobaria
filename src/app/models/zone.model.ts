export interface ZoneDetails {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  recommendedLevel: number
  mobs_outside: Mob[];
  dungeons?: Dungeon[];
  unlock: string;
  difficulty?: 'Facile' | 'Moyenne' | 'Difficile' | 'Très difficile';
}

export interface Zone {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  recommendedLevel: number
  mobs_outside: number[];
  dungeons?: number[];
  unlock: string;
  difficulty?: 'Facile' | 'Moyenne' | 'Difficile' | 'Très difficile';
  // items: ZoneItem[];
}

export interface Dungeon {
  id: number;
  name: string;
  description: string;
  requiredLevel: number;
  recommendedLevel: number;
  mobs: Mob[];
  boss?: Mob;
  imageUrl?: string;
}

export interface Mob {
  id: number;
  name: string;
  type: 'normal' | 'elite' | 'boss';
  drops?: ZoneItem[];
  imageUrl?: string;
  level: number;
}

export interface ZoneItem {
  id: number;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'material';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  setName?: string;
}

export interface SetBonus {
  setName: string;
  pieces: number;
  effects: string[];
}

