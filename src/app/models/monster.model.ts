import { Item } from "./item.model";

export interface Monster {
  id: number;
  name: string;
  description: string;
  level: number;
  attacks: MonsterAttack[];
  drops: MonsterDrop[];
  health: number;
  defense: number;
  imageUrl?: string;
  location?: string[];
  weakness?: string[];
}

export interface MonsterAttack {
  name: string;
  description: string;
  damage: number;
  type: string;
  cooldown: number;
}

export interface MonsterDrop {
  item: Item;
  itemName: string;
  dropRate: number; // percentage
  quantity?: number;
}