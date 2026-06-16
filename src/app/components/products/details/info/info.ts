import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  LucideBadgeInfo,
  LucideCalendar1,
  LucideCalendarClock,
  LucideBadgePercent,
  LucideBadgeDollarSign,
  LucideCircleCheck,
} from '@lucide/angular';
import { ComponentSharedStates } from '@components/shared/states/states';
import { ProductResponse } from '@core/interfaces/products/product.interface';

@Component({
  selector: 'component-products-details-info',
  imports: [
    CommonModule,
    LucideBadgeInfo,
    LucideCalendar1,
    LucideBadgeDollarSign,
    LucideCalendarClock,
    LucideBadgePercent,
    LucideCircleCheck,
    ComponentSharedStates,
  ],
  templateUrl: './info.html',
})
export class ComponentProductsDetailsInfo {
  @Input() product: ProductResponse | null = null;
}
