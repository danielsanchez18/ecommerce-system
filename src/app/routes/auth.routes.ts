import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'ingresar',
    loadComponent: () =>
      import('@pages/auth/login/login').then((m) => m.PageAuthLogin),
  },
];
