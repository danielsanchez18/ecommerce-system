import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/interfaces/shared/api-response.interface';
import {
  InvoiceRequest,
  InvoiceResponse,
} from '@core/interfaces/billing/billing.interface';
import { API_URL } from '@core/utils/api';

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  private apiUrl = `${API_URL}/billing`;

  constructor(private http: HttpClient) {}

  generateInvoice(
    orderId: string,
    request: InvoiceRequest,
  ): Observable<ApiResponse<InvoiceResponse>> {
    return this.http.post<ApiResponse<InvoiceResponse>>(
      `${this.apiUrl}/orders/${orderId}/generate`,
      request,
    );
  }

  getInvoiceById(id: string): Observable<ApiResponse<InvoiceResponse>> {
    return this.http.get<ApiResponse<InvoiceResponse>>(`${this.apiUrl}/${id}`);
  }

  getInvoiceByOrderId(
    orderId: string,
  ): Observable<ApiResponse<InvoiceResponse>> {
    return this.http.get<ApiResponse<InvoiceResponse>>(
      `${this.apiUrl}/orders/${orderId}`,
    );
  }

  getAllInvoices(): Observable<ApiResponse<InvoiceResponse[]>> {
    return this.http.get<ApiResponse<InvoiceResponse[]>>(this.apiUrl);
  }
}
