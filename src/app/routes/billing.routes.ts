import { Routes } from '@angular/router';

export const BILLING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@pages/billing/overview/overview').then(
        (m) => m.PageBillingOverview,
      ),
  },
  // {
  //   path: ':id',
  //   loadComponent: () =>
  //     import('@pages/categories/details/details').then(
  //       (m) => m.PageCategoriesDetails,
  //     ),
  // },
];
