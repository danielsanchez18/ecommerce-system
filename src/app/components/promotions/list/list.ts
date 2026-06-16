import { Component, inject, OnInit } from '@angular/core';
import { ComponentSharedSearchBox } from '@components/shared/search-box/search-box';
import { ComponentSharedFilters } from '@components/shared/filters/filters';
import { ComponentSharedEmpty } from '@components/shared/empty/empty';
import { ComponentPromotionsTable } from '../table/table';
import { ComponentSharedPaginator } from '@components/shared/paginator/paginator';
import {
  PromotionFilters,
  PromotionResponse,
} from '@core/interfaces/promotions/promotion.interface';
import { PromotionService } from '@core/service/promotions/promotion.service';

@Component({
  selector: 'component-promotions-list',
  imports: [
    ComponentSharedSearchBox,
    ComponentSharedFilters,
    ComponentSharedEmpty,
    ComponentPromotionsTable,
    ComponentSharedPaginator,
  ],
  templateUrl: './list.html',
})
export class ComponentPromotionsList implements OnInit {
  private readonly promotionService = inject(PromotionService);

  promotions: PromotionResponse[] = [];

  // Paginación
  page = 0;
  size = 10;
  totalElements = 0;
  totalPages = 0;

  // Filtros
  searchQuery = '';

  ngOnInit(): void {
    this.loadPromotions();
  }

  loadPromotions(): void {
    const filters: PromotionFilters = {
      page: this.page,
      size: this.size,
    };

    if (this.searchQuery.trim() !== '') {
      filters.name = this.searchQuery;
    }

    this.promotionService.getAll(filters).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.promotions = response.data.content;
          this.totalElements = response.data.totalElements;
          this.totalPages = response.data.totalPages;
          console.log(this.promotions);
        }
      },
      error: (err) => {
        console.error('Error al cargar promociones:', err);
      },
    });
  }

  onSearchQueryChange(query: string): void {
    this.searchQuery = query;
    this.page = 0;
    this.loadPromotions();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadPromotions();
  }
}
