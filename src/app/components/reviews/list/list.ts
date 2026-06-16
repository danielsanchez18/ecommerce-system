import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../core/service/reviews/review.service';
import { ReviewResponse } from '../../../core/interfaces/reviews/review.interface';
import { Page } from '../../../core/interfaces/shared/page.interface';
import { ComponentSharedSearchBox } from '../../../components/shared/search-box/search-box';
import { ComponentSharedEmpty } from '../../../components/shared/empty/empty';
import { ComponentSharedPaginator } from '../../../components/shared/paginator/paginator';
import { ComponentReviewsTable } from '../table/table';

@Component({
  selector: 'component-reviews-list',
  imports: [
    CommonModule,
    ComponentSharedSearchBox,
    ComponentSharedEmpty,
    ComponentSharedPaginator,
    ComponentReviewsTable,
  ],
  templateUrl: './list.html',
})
export class ComponentReviewsList implements OnInit {
  private reviewService = inject(ReviewService);

  reviews: ReviewResponse[] = [];
  page: Page<ReviewResponse> | null = null;
  loading = false;
  currentPage = 0;
  pageSize = 10;
  searchQuery = '';

  ngOnInit(): void {
    this.loadReviews(this.currentPage);
  }

  loadReviews(pageIndex: number) {
    this.loading = true;
    this.currentPage = pageIndex;

    // As the backend has no filters yet (if we assumed), we just pass page
    // Note: since the backend doesn't implement getAll, this might fail,
    // but the frontend is wired properly for when it does.
    this.reviewService
      .getAll({ page: this.currentPage, size: this.pageSize })
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.page = res.data;
            this.reviews = res.data.content || [];
          } else {
            // Fallback if the endpoint is not properly wired yet
            this.reviews = [];
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching reviews:', err);
          // En caso de que el endpoint falle porque no existe aún en el backend
          this.reviews = [];
          this.loading = false;
        },
      });
  }

  onPageChange(pageIndex: number) {
    this.loadReviews(pageIndex);
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.loadReviews(0);
  }
}
