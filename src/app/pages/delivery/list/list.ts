import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/service/orders/order.service';
import { OrderResponse } from '../../../core/interfaces/orders/order.interface';
import { LucideMapPin, LucidePackage, LucidePhone } from '@lucide/angular';
import { ComponentSharedEmpty } from '../../../components/shared/empty/empty';

@Component({
  selector: 'page-delivery-list',
  imports: [CommonModule, RouterLink, LucideMapPin, LucidePackage, LucidePhone, ComponentSharedEmpty],
  templateUrl: './list.html',
})
export class PageDeliveryList implements OnInit {
  private orderService = inject(OrderService);

  orders: OrderResponse[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getAll({ status: 'READY', orderType: 'DELIVERY' }).subscribe({
      next: (res) => {
        if (res.data) {
          this.orders = res.data.content || [];
        } else {
          this.orders = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching delivery orders:', err);
        this.orders = [];
        this.loading = false;
      }
    });
  }
}
