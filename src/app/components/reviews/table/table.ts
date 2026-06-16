import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReviewResponse } from '../../../core/interfaces/reviews/review.interface';

@Component({
  selector: 'component-reviews-table',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './table.html',
})
export class ComponentReviewsTable {
  @Input() reviews: ReviewResponse[] = [];
}
