import { Routes } from '@angular/router';

export const PROMOTION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@pages/promotions/overview/overview').then(
        (m) => m.PagePromotionsOverview,
      ),
  },
  {
    path: 'agregar',
    loadComponent: () =>
      import('@pages/promotions/add/add').then((m) => m.PagePromotionsAdd),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('@pages/promotions/details/details').then(
        (m) => m.PagePromotionsDetails,
      ),
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('@pages/promotions/edit/edit').then((m) => m.PagePromotionsEdit),
  },
];
