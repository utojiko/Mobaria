export interface Monster {
  id: string;
  name: string;
  description: string;
  level: number;
  health: number;
  attack: number;
  defense: number;
  family: string;
  location: string[];
  strengths: string[];
  weaknesses: string[];
  attacks: MonsterAttack[];
  drops: MonsterDrop[];
  imageUrl?: string;
}

export interface MonsterAttack {
  name: string;
  description: string;
  damage: number;
  type: string;
  cooldown: number;
}

export interface MonsterDrop {
  itemId: string;
  itemName: string;
  dropRate: number; // percentage
  minQuantity: number;
  maxQuantity: number;
}