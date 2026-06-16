import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/interfaces/shared/api-response.interface';
import { Page } from '@core/interfaces/shared/page.interface';
import { ReviewRequest, ReviewResponse } from '@core/interfaces/reviews/review.interface';
import { API_URL } from '@core/utils/api';

export interface ReviewFilters {
  page?: number;
  size?: number;
  rating?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/reviews`;

  create(request: ReviewRequest): Observable<ApiResponse<ReviewResponse>> {
    return this.http.post<ApiResponse<ReviewResponse>>(this.apiUrl, request);
  }

  getAll(filters?: ReviewFilters): Observable<ApiResponse<Page<ReviewResponse>>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const val = (filters as any)[key];
        if (val !== undefined && val !== null && val !== '') {
          params = params.set(key, val.toString());
        }
      });
    }
    return this.http.get<ApiResponse<Page<ReviewResponse>>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<ApiResponse<ReviewResponse>> {
    return this.http.get<ApiResponse<ReviewResponse>>(`${this.apiUrl}/${id}`);
  }

  getByOrderId(orderId: string): Observable<ApiResponse<ReviewResponse>> {
    return this.http.get<ApiResponse<ReviewResponse>>(`${this.apiUrl}/order/${orderId}`);
  }
}
