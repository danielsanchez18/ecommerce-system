import { Routes } from '@angular/router';

export const REVIEWS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@pages/reviews/overview/overview').then((m) => m.PageReviewsOverview),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('@pages/reviews/details/details').then((m) => m.PageReviewsDetails),
  }
];
