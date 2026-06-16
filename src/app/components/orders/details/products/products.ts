import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { OrderResponse, OrderItemResponse } from '@core/interfaces/orders/order.interface';
import { RouterLink } from '@angular/router';
import { ComponentSharedStates } from '@components/shared/states/states';
import { LucideBadgeCheck, LucideBadgeMinus } from '@lucide/angular';

@Component({
  selector: 'component-orders-details-products',
  imports: [
    CommonModule,
    RouterLink,
    ComponentSharedStates,
    LucideBadgeCheck,
    LucideBadgeMinus,
    CurrencyPipe,
  ],
  templateUrl: './products.html',
})
export class ComponentOrdersDetailsProducts implements OnChanges {
  @Input() order!: OrderResponse;

  productItems: OrderItemResponse[] = [];
  promotionItems: OrderItemResponse[] = [];

  ngOnChanges(): void {
    if (this.order && this.order.items) {
      this.productItems = this.order.items.filter(item => item.productId != null);
      this.promotionItems = this.order.items.filter(item => item.promotionId != null);
    }
  }
}
