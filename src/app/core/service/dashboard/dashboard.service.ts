import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/interfaces/shared/api-response.interface';
import { DashboardChartResponse, DashboardKpiResponse } from '@core/interfaces/dashboard/dashboard.interface';
import { API_URL } from '@core/utils/api';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly apiUrl = `${API_URL}/dashboard`;
  private http = inject(HttpClient);

  getKpis(): Observable<ApiResponse<DashboardKpiResponse>> {
    return this.http.get<ApiResponse<DashboardKpiResponse>>(`${this.apiUrl}/kpis`);
  }

  getChartsData(): Observable<ApiResponse<DashboardChartResponse>> {
    return this.http.get<ApiResponse<DashboardChartResponse>>(`${this.apiUrl}/charts`);
  }
}
