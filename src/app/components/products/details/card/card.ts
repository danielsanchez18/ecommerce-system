import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideClock,
  LucideTag,
  LucideBadgeCheck,
  LucideBadgeMinus,
  LucideBadgeX,
} from '@lucide/angular';
import { ProductResponse } from '@core/interfaces/products/product.interface';
import { ComponentSharedStates } from '@components/shared/states/states';

@Component({
  selector: 'component-products-details-card',
  imports: [
    CommonModule,
    ComponentSharedStates,
    RouterLink,
    LucideTag,
    LucideClock,
    LucideBadgeCheck,
    LucideBadgeMinus,
    LucideBadgeX,
    CurrencyPipe,
  ],
  templateUrl: './card.html',
})
export class ComponentProductsDetailsCard {
  @Input() product: ProductResponse | null = null;
  @Input() categoryName: string = '';
}
