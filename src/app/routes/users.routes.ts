import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@pages/users/overview/overview').then((m) => m.PageUsersOverview),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('@pages/users/details/overview/overview').then(
        (m) => m.PageUsersDetailsOverview,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@pages/users/details/info/info').then(
            (m) => m.PageUsersDetailsInfo,
          ),
      },
      {
        path: 'seguridad',
        loadComponent: () =>
          import('@pages/users/details/security/security').then(
            (m) => m.PageUsersDetailsSecurity,
          ),
      },
      {
        path: 'pedidos',
        loadComponent: () =>
          import('@pages/users/details/orders/orders').then(
            (m) => m.PageUsersDetailsOrders,
          ),
      },
    ],
  },
];
