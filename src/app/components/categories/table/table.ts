import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryResponse } from '@core/interfaces/categories/category.interface';
import {
  LucideBadgeCheck,
  LucideBadgeMinus,
  LucideBadgeX,
  LucideClipboardPenLine,
  LucidePackageCheck,
  LucideTag,
} from '@lucide/angular';

@Component({
  selector: 'component-categories-table',
  imports: [
    CommonModule,
    RouterLink,
    LucidePackageCheck,
    LucideBadgeCheck,
    LucideBadgeMinus,
    LucideBadgeX,
    LucideTag,
    LucideClipboardPenLine,
  ],
  templateUrl: './table.html',
})
export class ComponentCategoriesTable {
  @Input() categories: CategoryResponse[] = [];
  @Input() productCounts: { [categoryId: string]: number } = {};

  @Output() viewClick = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<CategoryResponse>();
  @Output() editClick = new EventEmitter<CategoryResponse>();
}
