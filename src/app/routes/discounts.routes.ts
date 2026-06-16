import { Routes } from '@angular/router';

export const DISCOUNT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@pages/discounts/overview/overview').then(
        (m) => m.PageDiscountsOverview,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('@pages/discounts/details/details').then(
        (m) => m.PageDiscountsDetails,
      ),
  },
];
