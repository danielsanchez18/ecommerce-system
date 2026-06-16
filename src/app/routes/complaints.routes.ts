import { Routes } from '@angular/router';

export const COMPLAINTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@pages/complaints/overview/overview').then((m) => m.PageComplaintsOverview),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('@pages/complaints/details/details').then((m) => m.PageComplaintsDetails),
  }
];
