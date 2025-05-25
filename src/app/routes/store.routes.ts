import { Routes } from '@angular/router';
import { StoreComponent } from '../features/store/store.component';

export const STORE_ROUTES: Routes = [
  {
    path: ':category',
    component: StoreComponent
  },
  {
    path: '',
    redirectTo: 'keys',
    pathMatch: 'full'
  }
];
