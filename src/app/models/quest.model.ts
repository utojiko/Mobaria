export interface Quest {
  id: number;
  name: string;
  description: string;
  minLevel: number;
  location: string;
  npc: string;
  steps: QuestStep[];
  rewards: QuestReward[];
  prerequisites: string[]; // IDs of prerequisite quests
  relatedQuests: string[]; // IDs of related quests
}

export interface QuestStep {
  id: number;
  description: string;
  objective: string;
  quantity?: number;
  targetId?: string; // Monster or item ID
}

export interface QuestReward {
  type: 'xp' | 'item' | 'currency' | 'reputation';
  value: number;
  item?: string;
  itemName?: string;
}