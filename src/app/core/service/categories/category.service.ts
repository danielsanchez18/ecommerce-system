import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/interfaces/shared/api-response.interface';
import { Page } from '@core/interfaces/shared/page.interface';
import {
  CategoryFilters,
  CategoryRequest,
  CategoryResponse
} from '@core/interfaces/categories/category.interface';
import { API_URL } from '@core/utils/api';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/categories`;

  /**
   * Creates a new category with an optional image file.
   * Utilizes multipart/form-data.
   */
  create(request: CategoryRequest, image?: File): Observable<ApiResponse<CategoryResponse>> {
    const formData = new FormData();
    const categoryBlob = new Blob([JSON.stringify(request)], { type: 'application/json' });
    formData.append('category', categoryBlob);
    if (image) {
      formData.append('image', image);
    }
    return this.http.post<ApiResponse<CategoryResponse>>(this.apiUrl, formData);
  }

  /**
   * Retrieves a category by its unique ID.
   */
  getById(id: string): Observable<ApiResponse<CategoryResponse>> {
    return this.http.get<ApiResponse<CategoryResponse>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Retrieves a paginated list of categories with query filters.
   */
  getAll(filters?: CategoryFilters): Observable<ApiResponse<Page<CategoryResponse>>> {
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
    return this.http.get<ApiResponse<Page<CategoryResponse>>>(this.apiUrl, { params });
  }

  /**
   * Updates an existing category (supporting partial details and optional image update).
   * Utilizes multipart/form-data.
   */
  update(id: string, request: CategoryRequest, image?: File): Observable<ApiResponse<CategoryResponse>> {
    const formData = new FormData();
    const categoryBlob = new Blob([JSON.stringify(request)], { type: 'application/json' });
    formData.append('category', categoryBlob);
    if (image) {
      formData.append('image', image);
    }
    return this.http.put<ApiResponse<CategoryResponse>>(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * Toggles the enabled state of a category.
   */
  changeStatus(id: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/change-status/${id}`, null);
  }

  /**
   * Soft or hard deletes a category by its ID.
   */
  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
