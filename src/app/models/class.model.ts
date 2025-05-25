
export interface GameClass {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  stats: {
    damage: number;
    defense: number;
    mobility: number;
    utility: number;
  };
  abilities: {
    name: string;
    description: string;
    cooldown: string;
  }[];
  playstyle: string;
}

export interface ClassAttack {
  id: number;
  name: string;
  description: string;
  damage: number;
  manaCost: number;
  cooldown: number;
  type: string;
  level: number;
  effects?: string[];
}

export interface EquipmentRecommendation {
  slot: string;
  itemName: string;
  itemId: string;
  reason: string;
}