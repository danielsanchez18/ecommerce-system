import { Routes } from '@angular/router';

export default [
  {
    path: '',
    redirectTo: 'pedidos',
    pathMatch: 'full'
  },
  {
    path: 'pedidos',
    loadComponent: () => import('./list/list').then(m => m.PageDeliveryList)
  },
  {
    path: 'pedidos/:id',
    loadComponent: () => import('./details/details').then(m => m.PageDeliveryDetails)
  }
] as Routes;
