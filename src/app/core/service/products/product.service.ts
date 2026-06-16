import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/interfaces/shared/api-response.interface';
import { Page } from '@core/interfaces/shared/page.interface';
import {
  ProductFilters,
  ProductRequest,
  ProductResponse
} from '@core/interfaces/products/product.interface';
import { API_URL } from '@core/utils/api';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/products`;

  /**
   * Creates a new product with an optional image file.
   * Utilizes multipart/form-data.
   */
  create(request: ProductRequest, image?: File): Observable<ApiResponse<ProductResponse>> {
    const formData = new FormData();
    const productBlob = new Blob([JSON.stringify(request)], { type: 'application/json' });
    formData.append('product', productBlob);
    if (image) {
      formData.append('image', image);
    }
    return this.http.post<ApiResponse<ProductResponse>>(this.apiUrl, formData);
  }

  /**
   * Retrieves a product by its unique ID.
   */
  getById(id: string): Observable<ApiResponse<ProductResponse>> {
    return this.http.get<ApiResponse<ProductResponse>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Retrieves a paginated list of products with query filters.
   */
  getAll(filters?: ProductFilters): Observable<ApiResponse<Page<ProductResponse>>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const val = (filters as any)[key];
        if (val !== undefined && val !== null && val !== '') {
          if (val instanceof Date) {
            params = params.set(key, val.toISOString());
          } else {
            params = params.set(key, val.toString());
          }
        }
      });
    }
    return this.http.get<ApiResponse<Page<ProductResponse>>>(this.apiUrl, { params });
  }

  /**
   * Updates an existing product (supporting partial details and optional image update).
   * Utilizes multipart/form-data.
   */
  update(id: string, request: ProductRequest, image?: File): Observable<ApiResponse<ProductResponse>> {
    const formData = new FormData();
    const productBlob = new Blob([JSON.stringify(request)], { type: 'application/json' });
    formData.append('product', productBlob);
    if (image) {
      formData.append('image', image);
    }
    return this.http.put<ApiResponse<ProductResponse>>(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * Toggles the enabled state of a product.
   */
  changeStatus(id: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/change-status/${id}`, null);
  }

  /**
   * Soft deletes a product by its ID.
   * Note: The backend uses PUT mapping for /delete/{id} instead of DELETE mapping.
   */
  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/delete/${id}`, null);
  }
}
