import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@layouts/dashboard/dashboard').then((m) => m.LayoutDashboard),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@pages/overview/overview').then((m) => m.PageOverview),
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('@routes/users.routes').then((m) => m.USER_ROUTES),
      },
      {
        path: 'roles',
        loadChildren: () =>
          import('@routes/roles.routes').then((m) => m.ROLES_ROUTES),
      },
      {
        path: 'categorias',
        loadChildren: () =>
          import('@routes/categories.routes').then((m) => m.CATEGORY_ROUTES),
      },
      {
        path: 'productos',
        loadChildren: () =>
          import('@routes/products.routes').then((m) => m.PRODUCT_ROUTES),
      },
      {
        path: 'descuentos',
        loadChildren: () =>
          import('@routes/discounts.routes').then((m) => m.DISCOUNT_ROUTES),
      },
      {
        path: 'promociones',
        loadChildren: () =>
          import('@routes/promotions.routes').then((m) => m.PROMOTION_ROUTES),
      },
      {
        path: 'restaurante',
        loadChildren: () =>
          import('@routes/restaurant.routes').then((m) => m.RESTAURANT_ROUTES),
      },
      {
        path: 'pedidos',
        loadChildren: () =>
          import('@routes/orders.routes').then((m) => m.ORDER_ROUTES),
      },
      {
        path: 'facturacion',
        loadChildren: () =>
          import('@routes/billing.routes').then((m) => m.BILLING_ROUTES),
      },
      {
        path: 'reseñas',
        loadChildren: () =>
          import('@routes/reviews.routes').then((m) => m.REVIEWS_ROUTES),
      },
      {
        path: 'reclamos',
        loadChildren: () =>
          import('@routes/complaints.routes').then((m) => m.COMPLAINTS_ROUTES),
      },
    ],
  },
];
