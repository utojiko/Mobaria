import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'wiki',
    loadChildren: () => import('./routes/wiki.routes').then(m => m.WIKI_ROUTES)
  },
  {
    path: 'store',
    loadChildren: () => import('./routes/store.routes').then(m => m.STORE_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];