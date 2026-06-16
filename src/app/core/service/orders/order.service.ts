import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/interfaces/shared/api-response.interface';
import { Page } from '@core/interfaces/shared/page.interface';
import { OrderFilters, OrderRequest, OrderResponse, OrderHistoryResponse } from '@core/interfaces/orders/order.interface';
import { API_URL } from '@core/utils/api';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/orders`;

  getAll(filters?: OrderFilters): Observable<ApiResponse<Page<OrderResponse>>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const val = (filters as any)[key];
        if (val !== undefined && val !== null && val !== '') {
          // If the filter is a Date object, convert to ISOString to match Spring DateTimeFormat
          if (val instanceof Date) {
            params = params.set(key, val.toISOString());
          } else {
            params = params.set(key, val.toString());
          }
        }
      });
    }

    // Default sorting to most recent first
    if (!params.has('sort')) {
      params = params.set('sort', 'createdAt,desc');
    }

    return this.http.get<ApiResponse<Page<OrderResponse>>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<ApiResponse<OrderResponse>> {
    return this.http.get<ApiResponse<OrderResponse>>(`${this.apiUrl}/${id}`);
  }

  getHistory(id: string): Observable<ApiResponse<OrderHistoryResponse[]>> {
    return this.http.get<ApiResponse<OrderHistoryResponse[]>>(`${this.apiUrl}/${id}/history`);
  }

  create(request: OrderRequest): Observable<ApiResponse<OrderResponse>> {
    return this.http.post<ApiResponse<OrderResponse>>(this.apiUrl, request);
  }

  updated(id: string, request: OrderRequest): Observable<ApiResponse<OrderResponse>> {
    return this.http.put<ApiResponse<OrderResponse>>(`${this.apiUrl}/${id}`, request);
  }

  updateStatus(id: string, status: string, latitude?: number, longitude?: number): Observable<ApiResponse<OrderResponse>> {
    let params = new HttpParams().set('status', status);
    
    if (latitude !== undefined && longitude !== undefined) {
      params = params.set('latitude', latitude.toString());
      params = params.set('longitude', longitude.toString());
    }

    return this.http.put<ApiResponse<OrderResponse>>(`${this.apiUrl}/${id}/status`, null, { params });
  }

  assignStaff(id: string, registeredBy?: string, attendedBy?: string, deliveryDriverId?: string): Observable<ApiResponse<OrderResponse>> {
    let params = new HttpParams();
    if (registeredBy) params = params.set('registeredBy', registeredBy);
    if (attendedBy) params = params.set('attendedBy', attendedBy);
    if (deliveryDriverId) params = params.set('deliveryDriverId', deliveryDriverId);

    return this.http.put<ApiResponse<OrderResponse>>(`${this.apiUrl}/${id}/assign-staff`, null, { params });
  }

  getByUser(userId: string, page: number = 0, size: number = 10): Observable<ApiResponse<Page<OrderResponse>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<Page<OrderResponse>>>(`${this.apiUrl}/user/${userId}`, { params });
  }
}
