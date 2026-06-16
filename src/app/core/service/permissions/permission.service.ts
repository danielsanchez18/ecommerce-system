import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PermissionRequest, PermissionResponse } from '@core/interfaces/permissions/permission.interface';
import { API_URL } from '@core/utils/api';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/permissions`;

  create(request: PermissionRequest): Observable<PermissionResponse> {
    return this.http.post<PermissionResponse>(this.apiUrl, request);
  }

  findAll(): Observable<PermissionResponse[]> {
    return this.http.get<PermissionResponse[]>(this.apiUrl);
  }

  findById(id: string): Observable<PermissionResponse> {
    return this.http.get<PermissionResponse>(`${this.apiUrl}/${id}`);
  }

  findByCode(code: string): Observable<PermissionResponse[]> {
    return this.http.get<PermissionResponse[]>(`${this.apiUrl}/${code}/code`);
  }
}
