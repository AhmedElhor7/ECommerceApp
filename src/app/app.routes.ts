import { Routes } from '@angular/router';

// define app routes
export const routes: Routes = [
  {
    path: '', redirectTo: 'auth/login', pathMatch: 'full'
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.routes').then(m => m.PRODUCTS_ROUTES)
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.routes').then(m => m.CART_ROUTES)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  { 
    path: '**', 
    loadChildren: () => import('./not-found/not-found.routes').then(m => m.NOTFOUND_ROUTES)
  }
];


