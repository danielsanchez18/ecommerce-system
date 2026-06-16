import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  LucideBadgeCheck,
  LucideBadgeMinus,
  LucideBadgeX,
  LucideTag,
} from '@lucide/angular';
import { ProductResponse } from '@core/interfaces/products/product.interface';
import { ComponentSharedPaginator } from '@components/shared/paginator/paginator';

@Component({
  selector: 'component-categories-details-products',
  imports: [
    CommonModule,
    ComponentSharedPaginator,
    LucideBadgeCheck,
    LucideBadgeMinus,
    LucideBadgeX,
    LucideTag,
    CurrencyPipe,
  ],
  templateUrl: './products.html',
})
export class ComponentCategoriesDetailsProducts {
  @Input() products: ProductResponse[] = [];
  @Input() page: number = 0;
  @Input() totalPages: number = 0;
  @Input() totalElements: number = 0;

  @Output() pageChange = new EventEmitter<number>();
}
