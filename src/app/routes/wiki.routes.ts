import { Routes } from '@angular/router';
import { WikiComponent } from '../features/wiki/wiki.component';
import { WikiHomeComponent } from '../features/wiki/components/wiki-home/wiki-home.component';

export const WIKI_ROUTES: Routes = [
  {
    path: '',
    component: WikiComponent,
    children: [
      {
        path: '',
        component: WikiHomeComponent
      },
      {
        path: 'world',
        loadChildren: () => import('./world.routes').then(m => m.WORLD_ROUTES)
      },
      {
        path: 'mechanics',
        loadChildren: () => import('./mechanics.routes').then(m => m.MECHANICS_ROUTES)
      },
      {
        path: 'classes',
        loadChildren: () => import('./classes.routes').then(m => m.CLASSES_ROUTES)
      }
    ]
  }
];