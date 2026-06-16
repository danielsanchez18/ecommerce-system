import { Router, RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentRestaurantTables } from '@components/restaurant/tables/tables';
import { OrderCartService } from '@core/service/orders/order-cart.service';

@Component({
  selector: 'page-restaurant-overview',
  imports: [CommonModule, ComponentRestaurantTables],
  templateUrl: './overview.html',
})
export class PageRestaurantOverview {
  private readonly orderCartService = inject(OrderCartService);
  private readonly router = inject(Router);

  tomarPedido() {
    this.orderCartService.clearTables();
    this.router.navigate(['/dashboard/restaurante/pedido']);
  }
}
