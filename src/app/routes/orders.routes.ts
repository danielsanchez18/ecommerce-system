import { Routes } from '@angular/router';

export const ORDER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@pages/orders/overview/overview').then(
        (m) => m.PageOrdersOverview,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('@pages/orders/details/details').then((m) => m.PageOrdersDetails),
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('@pages/orders/edit/edit').then((m) => m.PageOrdersEdit),
  },
];
