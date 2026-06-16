import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/interfaces/shared/api-response.interface';
import { Page } from '@core/interfaces/shared/page.interface';
import { ComplaintRequest, ComplaintResponse, ComplaintFilters } from '@core/interfaces/complaints/complaint.interface';
import { API_URL } from '@core/utils/api';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/complaints`;

  create(request: ComplaintRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(this.apiUrl, request);
  }

  getAll(filters?: ComplaintFilters): Observable<ApiResponse<Page<ComplaintResponse>>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const val = (filters as any)[key];
        if (val !== undefined && val !== null && val !== '') {
          params = params.set(key, val.toString());
        }
      });
    }
    return this.http.get<ApiResponse<Page<ComplaintResponse>>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<ApiResponse<ComplaintResponse>> {
    return this.http.get<ApiResponse<ComplaintResponse>>(`${this.apiUrl}/${id}`);
  }
}
