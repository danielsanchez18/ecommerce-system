import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/interfaces/shared/api-response.interface';
import { Page } from '@core/interfaces/shared/page.interface';
import {
  DiscountFilters,
  DiscountRequest,
  DiscountResponse
} from '@core/interfaces/discounts/discount.interface';
import { API_URL } from '@core/utils/api';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/discounts`;

  create(request: DiscountRequest): Observable<ApiResponse<DiscountResponse>> {
    return this.http.post<ApiResponse<DiscountResponse>>(this.apiUrl, request);
  }

  getById(id: string): Observable<ApiResponse<DiscountResponse>> {
    return this.http.get<ApiResponse<DiscountResponse>>(`${this.apiUrl}/${id}`);
  }

  getAll(filters?: DiscountFilters): Observable<ApiResponse<Page<DiscountResponse>>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const val = (filters as any)[key];
        if (val !== undefined && val !== null && val !== '') {
          params = params.set(key, val.toString());
        }
      });
    }
    return this.http.get<ApiResponse<Page<DiscountResponse>>>(this.apiUrl, { params });
  }

  update(id: string, request: DiscountRequest): Observable<ApiResponse<DiscountResponse>> {
    return this.http.put<ApiResponse<DiscountResponse>>(`${this.apiUrl}/${id}`, request);
  }

  changeStatus(id: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/change-status/${id}`, null);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
