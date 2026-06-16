import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ComponentSharedStates } from '@components/shared/states/states';
import { OrderResponse } from '@core/interfaces/orders/order.interface';
import {
  LucideShoppingBag,
  LucideStore,
  LucideUtensilsCrossed,
  LucideEye,
  LucideSquarePen,
  LucideBadgeX
} from '@lucide/angular';


@Component({
  selector: 'component-orders-table',
  imports: [
    CommonModule,
    DatePipe,
    ComponentSharedStates,
    LucideShoppingBag,
    LucideStore,
    LucideUtensilsCrossed,
    LucideEye,
    LucideSquarePen,
    LucideBadgeX
  ],
  templateUrl: './table.html',
})
export class ComponentOrdersTable {
  @Input() orders: OrderResponse[] = [];

  @Output() viewClick = new EventEmitter<OrderResponse>();
  @Output() editClick = new EventEmitter<OrderResponse>();
  @Output() statusChange = new EventEmitter<OrderResponse>();

  mapStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'Pendiente',
      'PREPARING': 'En Proceso',
      'READY': 'Listo',
      'COMPLETED': 'Entregado',
      'CANCELLED': 'Cancelado'
    };
    return statusMap[status] || status;
  }
}
