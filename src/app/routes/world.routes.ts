import { Routes } from '@angular/router';
import { WorldComponent } from '../features/wiki/components/world/world.component';
// import { QuestsComponent } from '../components/world/quests/quests.component';
// import { QuestDetailComponent } from './components/quest-detail/quest-detail.component';
// import { MonstersComponent } from './components/monsters/monsters.component';
// import { MonsterDetailComponent } from './components/monster-detail/monster-detail.component';
import { ZonesComponent } from '../features/wiki/components/world/zones/zones.component';
import { ZoneDetailComponent } from '../features/wiki/components/world/zone-detail/zone-detail.component';

export const WORLD_ROUTES: Routes = [
  {
    path: '',
    component: WorldComponent
  },
  // {
  //   path: 'quests',
  //   component: QuestsComponent
  // },
  // {
  //   path: 'quests/:id',
  //   component: QuestDetailComponent
  // },
  // {
  //   path: 'monsters',
  //   component: MonstersComponent
  // },
  // {
  //   path: 'monsters/:id',
  //   component: MonsterDetailComponent
  // },
  {
    path: 'zones',
    component: ZonesComponent
  },
  {
    path: 'zones/:id',
    component: ZoneDetailComponent
  }
];