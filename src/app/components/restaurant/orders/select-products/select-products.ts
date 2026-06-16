import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComponentRestaurantOrderAddProduct } from '@components/restaurant/orders/add-product/add-product';
import { ComponentSharedStates } from '@components/shared/states/states';
import { OrderCartService } from '@core/service/orders/order-cart.service';
import {
  CartItemRequest,
  CartItemResponse,
} from '@core/interfaces/cart/cart.interface';
import {
  LucideBadgeCheck,
  LucideBadgeMinus,
  LucideTrash2,
  LucidePackageSearch,
} from '@lucide/angular';

@Component({
  selector: 'component-restaurant-order-select-products',
  imports: [
    ComponentSharedStates,
    ComponentRestaurantOrderAddProduct,
    RouterLink,
    CommonModule,
    LucideTrash2,
    LucideBadgeCheck,
    LucideBadgeMinus,
    LucidePackageSearch,
  ],
  templateUrl: './select-products.html',
})
export class ComponentRestaurantOrderSelectProducts implements OnInit {
  orderCartService = inject(OrderCartService);

  // Cupones válidos (mockup)
  validCoupons = ['DESCUENTO50', 'DESCVERA', 'VERANO2025'];

  coupon: string = 'DESCUENTO50';
  isCouponValid: boolean | null = true; // null: no evaluado, true/false según validación

  ngOnInit() {
    this.validateCoupon(this.coupon);
    this.orderCartService.setCouponCode(this.coupon);
  }

  validateCoupon(value: string) {
    this.isCouponValid =
      value.length === 0
        ? null
        : this.validCoupons.includes(value.toUpperCase().trim());
  }

  onCouponChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.coupon = input.value.toUpperCase().trim();
    this.validateCoupon(this.coupon);
    if (this.isCouponValid) {
      this.orderCartService.setCouponCode(this.coupon);
    } else {
      this.orderCartService.setCouponCode('');
    }
  }

  incrementQuantity(item: CartItemResponse) {
    const req: CartItemRequest = {
      productId: item.product?.id,
      promotionId: item.promotion?.id,
      quantity: item.quantity + 1,
    };
    this.orderCartService.updateItemQuantity(req);
  }

  decrementQuantity(item: CartItemResponse) {
    if (item.quantity > 1) {
      const req: CartItemRequest = {
        productId: item.product?.id,
        promotionId: item.promotion?.id,
        quantity: item.quantity - 1,
      };
      this.orderCartService.updateItemQuantity(req);
    }
  }

  removeItem(item: CartItemResponse) {
    const id = item.product?.id || item.promotion?.id;
    if (id) {
      this.orderCartService.removeItem(id);
    }
  }

  onManualDiscountChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value) || 0;
    this.orderCartService.setManualDiscount(value);
  }
}
