import { Routes } from '@angular/router';
import { LayoutDelivery } from '../layouts/delivery/delivery';

export const DELIVERY_ROUTES: Routes = [
  {
    path: '',
    component: LayoutDelivery,
    loadChildren: () => import('../pages/delivery/delivery.routes')
  }
];
