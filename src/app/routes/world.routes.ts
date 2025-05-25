import { Routes } from '@angular/router';
import { WorldComponent } from '../features/wiki/components/world/world.component';
import { QuestsComponent } from '../features/wiki/components/world/quests/quests.component';
import { ZonesComponent } from '../features/wiki/components/world/zones/zones.component';
import { ZoneDetailComponent } from '../features/wiki/components/world/zone-detail/zone-detail.component';

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
  }
];