import { Routes } from '@angular/router';
import { WorldComponent } from '../features/wiki/components/world/world.component';
import { QuestsComponent } from '../features/wiki/components/world/quests/quests.component';
import { ZonesComponent } from '../features/wiki/components/world/zones/zones.component';
import { ZoneDetailComponent } from '../features/wiki/components/world/zones/zone-detail/zone-detail.component';
import { MonsterDetailComponent } from '../features/wiki/components/world/monsters/monster-details/monster-details.component';
import { MonstersComponent } from '../features/wiki/components/world/monsters/monsters.component';
import { DungeonsComponent } from '../features/wiki/components/world/dungeons/dungeons.component';
import { DungeonDetailComponent } from '../features/wiki/components/world/dungeons/dungeon-details/dungeon-details.component';

export const WORLD_ROUTES: Routes = [
  {
    path: '',
    component: WorldComponent
  },
  {
    path: 'quests',
    component: QuestsComponent
  },
  {
    path: 'zones',
    component: ZonesComponent
  },
  {
    path: 'zones/:id',
    component: ZoneDetailComponent
  },
  {
    path: 'monsters/:id',
    component: MonsterDetailComponent
  },
  {
    path: 'monsters',
    component: MonstersComponent
  },
  {
    path: 'dungeons/:id',
    component: DungeonDetailComponent
  },
  {
    path: 'dungeons',
    component: DungeonsComponent
  }
];