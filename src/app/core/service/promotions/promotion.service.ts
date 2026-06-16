import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/interfaces/shared/api-response.interface';
import { Page } from '@core/interfaces/shared/page.interface';
import {
  PromotionFilters,
  PromotionRequest,
  PromotionResponse
} from '@core/interfaces/promotions/promotion.interface';
import { API_URL } from '@core/utils/api';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/promotions`;

  create(request: PromotionRequest): Observable<ApiResponse<PromotionResponse>> {
    return this.http.post<ApiResponse<PromotionResponse>>(this.apiUrl, request);
  }

  getById(id: string): Observable<ApiResponse<PromotionResponse>> {
    return this.http.get<ApiResponse<PromotionResponse>>(`${this.apiUrl}/${id}`);
  }

  getAll(filters?: PromotionFilters): Observable<ApiResponse<Page<PromotionResponse>>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const val = (filters as any)[key];
        if (val !== undefined && val !== null && val !== '') {
          params = params.set(key, val.toString());
        }
      });
    }
    return this.http.get<ApiResponse<Page<PromotionResponse>>>(this.apiUrl, { params });
  }

  update(id: string, request: PromotionRequest): Observable<ApiResponse<PromotionResponse>> {
    return this.http.put<ApiResponse<PromotionResponse>>(`${this.apiUrl}/${id}`, request);
  }

  changeStatus(id: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/change-status/${id}`, null);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
