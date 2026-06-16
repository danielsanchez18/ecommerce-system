import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryResponse } from '@core/interfaces/categories/category.interface';
import {
  LucideBadgeCheck,
  LucideBadgeInfo,
  LucideBadgeMinus,
  LucideCalendar1,
  LucideCalendarCheck,
  LucidePackage,
} from '@lucide/angular';

@Component({
  selector: 'component-categories-details-card',
  imports: [
    CommonModule,
    LucideBadgeInfo,
    LucideBadgeMinus,
    LucideCalendar1,
    LucideCalendarCheck,
    LucideBadgeCheck,
    LucidePackage,
  ],
  templateUrl: './card.html',
})
export class ComponentCategoriesDetailsCard {
  @Input() category: CategoryResponse | null = null;
  @Input() productCount: number = 0;
}
