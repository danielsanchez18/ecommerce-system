import { Routes } from '@angular/router';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@pages/products/overview/overview').then(
        (m) => m.PageProductsOverview,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('@pages/products/details/details').then(
        (m) => m.PageProductsDetails,
      ),
  },
];
