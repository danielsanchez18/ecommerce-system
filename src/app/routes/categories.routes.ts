import { Routes } from '@angular/router';

export const CATEGORY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@pages/categories/overview/overview').then(
        (m) => m.PageCategoriesOverview,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('@pages/categories/details/details').then(
        (m) => m.PageCategoriesDetails,
      ),
  },
];
