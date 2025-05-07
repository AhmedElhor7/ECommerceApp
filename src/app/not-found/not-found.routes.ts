import { Routes } from '@angular/router';

export const NOTFOUND_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./not-found.component').then(m => m.NotFoundComponent)
  }
];
