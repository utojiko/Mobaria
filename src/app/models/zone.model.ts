export interface Zone {
  id: string;
  name: string;
  description: string;
  level: { min: number; max: number };
  biome: string;
  monsters: string[]; // IDs of monsters in this zone
  dungeon?: {
    id: string;
    name: string;
    bossId: string;
    minLevel: number;
  };
  items: ZoneItem[];
  setBonus?: SetBonus;
  imageUrl?: string;
}

export interface ZoneItem {
  id: string;
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