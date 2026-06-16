import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/interfaces/shared/api-response.interface';
import { Page } from '@core/interfaces/shared/page.interface';
import { TableFilters, TableRequest, TableResponse } from '@core/interfaces/tables/table.interface';
import { API_URL } from '@core/utils/api';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/tables`;

  getAll(filters?: TableFilters): Observable<ApiResponse<Page<TableResponse>>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const val = (filters as any)[key];
        if (val !== undefined && val !== null && val !== '') {
          params = params.set(key, val.toString());
        }
      });
    }
    return this.http.get<ApiResponse<Page<TableResponse>>>(this.apiUrl, { params });
  }

  create(request: TableRequest): Observable<ApiResponse<TableResponse>> {
    return this.http.post<ApiResponse<TableResponse>>(this.apiUrl, request);
  }

  updateStatus(id: string, status: string): Observable<ApiResponse<TableResponse>> {
    let params = new HttpParams().set('status', status);
    return this.http.patch<ApiResponse<TableResponse>>(`${this.apiUrl}/${id}/status`, null, { params });
  }

  changeStatus(id: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/change-status/${id}`, null);
  }

  promptAndFreeTables(primaryTableId: string): void {
    // Buscar la mesa y su grupo
    this.getAll({ size: 100 } as any).subscribe((res) => {
      if (res.success && res.data) {
        const tables = res.data.content;
        // The group includes the primary table and any table merged with it
        const group = tables.filter(
          t => t.id === primaryTableId || t.mergedWithTableId === primaryTableId
        );

        if (group.length > 0) {
          const names = group.map(t => `MESA ${t.tableNumber}`).join(' Y ');
          Swal.fire({
            title: `¿Liberar ${names}?`,
            text: 'El pedido se ha cerrado. ¿Deseas marcar la(s) mesa(s) como DISPONIBLES?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, liberar',
            cancelButtonText: 'No',
          }).then((result) => {
            if (result.isConfirmed) {
              const updates = group.map(t => this.updateStatus(t.id, 'AVAILABLE'));
              forkJoin(updates).subscribe(() => {
                Swal.fire('¡Liberadas!', `Las mesas (${names}) ahora están disponibles.`, 'success');
              });
            }
          });
        }
      }
    });
  }

  mergeTables(id: string, mergeWithId: string): Observable<ApiResponse<TableResponse>> {
    let params = new HttpParams().set('mergeWithId', mergeWithId);
    return this.http.post<ApiResponse<TableResponse>>(`${this.apiUrl}/${id}/merge`, null, { params });
  }

  unmergeTable(id: string): Observable<ApiResponse<TableResponse>> {
    return this.http.post<ApiResponse<TableResponse>>(`${this.apiUrl}/${id}/unmerge`, null);
  }
}
