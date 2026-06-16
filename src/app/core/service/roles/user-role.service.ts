import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/interfaces/shared/api-response.interface';
import { Page } from '@core/interfaces/shared/page.interface';
import { UserRole } from '@core/interfaces/roles/role.interface';
import { API_URL } from '@core/utils/api';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/user-roles`;

  assignRoleToUser(userRole: Partial<UserRole>): Observable<ApiResponse<UserRole>> {
    return this.http.post<ApiResponse<UserRole>>(this.apiUrl, userRole);
  }

  findById(id: string): Observable<ApiResponse<UserRole>> {
    return this.http.get<ApiResponse<UserRole>>(`${this.apiUrl}/${id}`);
  }

  findRolesByUserId(userId: string): Observable<ApiResponse<UserRole[]>> {
    return this.http.get<ApiResponse<UserRole[]>>(`${this.apiUrl}/user/${userId}`);
  }

  findUsersByRoleId(
    roleId: string,
    pagination?: { page?: number; size?: number; sort?: string }
  ): Observable<ApiResponse<Page<UserRole>>> {
    let params = new HttpParams();
    if (pagination) {
      Object.keys(pagination).forEach((key) => {
        const val = (pagination as any)[key];
        if (val !== undefined && val !== null && val !== '') {
          params = params.set(key, val.toString());
        }
      });
    }
    return this.http.get<ApiResponse<Page<UserRole>>>(`${this.apiUrl}/role/${roleId}`, { params });
  }

  remove(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
