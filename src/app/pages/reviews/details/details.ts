import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReviewService } from '@core/service/reviews/review.service';
import { ReviewResponse } from '@core/interfaces/reviews/review.interface';

@Component({
  selector: 'page-reviews-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './details.html',
})
export class PageReviewsDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly reviewService = inject(ReviewService);

  review: ReviewResponse | null = null;
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadReview(id);
    } else {
      this.error = 'No se proporcionó un ID de reseña.';
      this.isLoading = false;
    }
  }

  private loadReview(id: string): void {
    this.isLoading = true;
    this.reviewService.getById(id).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.review = response.data;
        } else {
          this.error = response.message || 'No se pudo cargar la reseña.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Ocurrió un error al cargar la reseña.';
        console.error('Error cargando reseña', err);
      },
    });
  }
}
