import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/interfaces/shared/api-response.interface';
import { Page } from '@core/interfaces/shared/page.interface';
import {
  CreateUserRequest,
  UpdateEmailRequest,
  UpdatePasswordRequest,
  UpdateProfileRequest,
  UserFilters,
  UserResponse,
} from '@core/interfaces/users/user.interface';
import { API_URL } from '@core/utils/api';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = `${API_URL}/users`;
  private http = inject(HttpClient);

  /**
   * Creates a new user with an optional profile image.
   * Leverages multipart/form-data with a JSON payload string.
   */
  create(
    request: CreateUserRequest,
    image?: File,
  ): Observable<ApiResponse<UserResponse>> {
    const formData = new FormData();
    formData.append('user', JSON.stringify(request));
    if (image) {
      formData.append('image', image);
    }
    return this.http.post<ApiResponse<UserResponse>>(this.apiUrl, formData);
  }

  /**
   * Retrieves a single user by their unique ID.
   */
  findById(id: string): Observable<ApiResponse<UserResponse>> {
    return this.http.get<ApiResponse<UserResponse>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Retrieves a paginated list of users filtered by query parameters.
   */
  findAll(filters?: UserFilters): Observable<ApiResponse<Page<UserResponse>>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const val = (filters as any)[key];
        if (val !== undefined && val !== null && val !== '') {
          // If date objects or other non-string objects are passed, serialize appropriately
          if (val instanceof Date) {
            params = params.set(key, val.toISOString());
          } else {
            params = params.set(key, val.toString());
          }
        }
      });
    }
    return this.http.get<ApiResponse<Page<UserResponse>>>(this.apiUrl, {
      params,
    });
  }

  /**
   * Updates user profile info with an optional profile image.
   * Leverages multipart/form-data with a JSON payload string.
   */
  updateProfile(
    id: string,
    request: UpdateProfileRequest,
    image?: File,
  ): Observable<ApiResponse<UserResponse>> {
    const formData = new FormData();
    formData.append('user', JSON.stringify(request));
    if (image) {
      formData.append('image', image);
    }
    return this.http.put<ApiResponse<UserResponse>>(
      `${this.apiUrl}/${id}/profile`,
      formData,
    );
  }

  /**
   * Updates user password.
   */
  updatePassword(
    id: string,
    request: UpdatePasswordRequest,
  ): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(
      `${this.apiUrl}/${id}/password`,
      request,
    );
  }

  /**
   * Updates user email address.
   */
  updateEmail(
    id: string,
    request: UpdateEmailRequest,
  ): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(
      `${this.apiUrl}/${id}/email`,
      request,
    );
  }

  /**
   * Toggles user enablement status.
   */
  changeStatus(id: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(
      `${this.apiUrl}/${id}/change-status`,
      null,
    );
  }

  /**
   * Performs a soft delete or hard delete based on backend configuration.
   */
  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}/delete`);
  }
}
