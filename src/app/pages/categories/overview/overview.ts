import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentCategoriesList } from '@components/categories/list/list';
import { ComponentCategoriesAdd } from '@components/categories/add/add';
import { ComponentCategoriesEdit } from '@components/categories/edit/edit';
import { CategoryResponse } from '@core/interfaces/categories/category.interface';

@Component({
  selector: 'page-categories-overview',
  imports: [
    CommonModule,
    ComponentCategoriesList,
    ComponentCategoriesAdd,
    ComponentCategoriesEdit,
  ],
  templateUrl: './overview.html',
})
export class PageCategoriesOverview {
  selectedCategory: CategoryResponse | null = null;

  onEditCategory(category: CategoryResponse): void {
    this.selectedCategory = category;
  }
}
