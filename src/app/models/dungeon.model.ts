import { Mob } from "./zone.model";

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