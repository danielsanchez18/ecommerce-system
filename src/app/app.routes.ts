import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('@routes/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('@routes/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: 'delivery',
    loadChildren: () =>
      import('@routes/delivery.routes').then((m) => m.DELIVERY_ROUTES),
  },
];
