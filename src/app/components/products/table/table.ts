import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductResponse } from '@core/interfaces/products/product.interface';
import { ComponentSharedStates } from '@components/shared/states/states';
import {
  LucideBadgeCheck,
  LucideBadgeMinus,
  LucideBadgeX,
  LucideClipboardPenLine,
  LucideEye,
  LucideTag,
} from '@lucide/angular';

@Component({
  selector: 'component-products-table',
  imports: [
    CommonModule,
    RouterLink,
    CurrencyPipe,
    ComponentSharedStates,
    LucideBadgeCheck,
    LucideBadgeMinus,
    LucideBadgeX,
    LucideTag,
    LucideClipboardPenLine,
    LucideEye,
  ],
  templateUrl: './table.html',
})
export class ComponentProductsTable {
  @Input() products: ProductResponse[] = [];
  @Input() categoriesMap: Record<string, string> = {};

  @Output() viewClick = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<ProductResponse>();
  @Output() editClick = new EventEmitter<ProductResponse>();
}
