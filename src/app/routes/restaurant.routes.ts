import { Routes } from '@angular/router';

export const RESTAURANT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@pages/restaurant/overview/overview').then(
        (m) => m.PageRestaurantOverview,
      ),
  },
  {
    path: 'pedido',
    loadComponent: () =>
      import('@pages/restaurant/order/order').then(
        (m) => m.PageRestaurantOrder,
      ),
  },
];
