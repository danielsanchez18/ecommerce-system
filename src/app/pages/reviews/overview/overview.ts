import { Component } from '@angular/core';
import { ComponentReviewsList } from '@components/reviews/list/list';

@Component({
  selector: 'page-reviews-overview',
  imports: [ComponentReviewsList],
  templateUrl: './overview.html',
})
export class PageReviewsOverview {}
