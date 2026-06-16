import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/interfaces/shared/api-response.interface';
import { RolePermission } from '@core/interfaces/roles/role.interface';
import { API_URL } from '@core/utils/api';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/role-permissions`;

  assignPermission(rolePermission: Partial<RolePermission>): Observable<ApiResponse<RolePermission>> {
    return this.http.post<ApiResponse<RolePermission>>(this.apiUrl, rolePermission);
  }

  findById(id: string): Observable<ApiResponse<RolePermission>> {
    return this.http.get<ApiResponse<RolePermission>>(`${this.apiUrl}/${id}`);
  }

  findByRoleId(roleId: string): Observable<ApiResponse<RolePermission[]>> {
    return this.http.get<ApiResponse<RolePermission[]>>(`${this.apiUrl}/role/${roleId}`);
  }

  remove(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
