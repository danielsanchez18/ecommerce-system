import { Routes } from '@angular/router';

export const ROLES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@pages/roles/overview/overview').then((m) => m.PageRolesOverview),
  },
  {
    path: 'agregar',
    loadComponent: () =>
      import('@pages/roles/add/add').then((m) => m.PageRolesAdd),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('@pages/roles/details/details').then((m) => m.PageRolesDetails),
  },
];
